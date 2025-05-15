/**
 * Service – Skill & Curriculum Progress (v-fix BigInt)
 * ----------------------------------------------------
 * 👉  แก้ COUNT / SUM ให้ cast เป็น ::int เพื่อตัดปัญหา BigInt
 */
import { safeQuery } from '../../lib/utils.ts';
import {
  CurriculumProgress,
  StudentProgress,
  StudentActivityHistory,
  ProfessorStudentOverview,
  StudentSkillEntry,
  CurriculumSkillGap,
} from '../../type/progress.ts';
import { Student } from '../../type/app.ts';
import { UUIDTypes } from '../../lib/uuid.ts';

/* ---------------------------------------------------------------------------
 * Internal helper row (ใช้ภายใน service)
 * -------------------------------------------------------------------------*/
type CurriculumSkillMatrixRow = CurriculumSkillGap & {
  required_level: number;
  total_students: number;
  units_have: number;
};

/* ---------------------------------------------------------------------------
 * Matrix – หน่วย required / have ต่อ skill
 * -------------------------------------------------------------------------*/
export const getCurriculumSkillMatrix = (curriculumId: UUIDTypes) =>
  safeQuery(async (c) => {
    const { rows } = await c.queryObject<CurriculumSkillMatrixRow>(
      `
      WITH
      stu AS (
        SELECT id
        FROM student
        WHERE curriculum_id = $1 AND is_active = TRUE
      ),
      req AS (
        SELECT skill_id, required_level
        FROM curriculum_skill
        WHERE curriculum_id = $1
      ),
      pairs AS (
        SELECT
          st.id           AS student_id,
          r.skill_id,
          r.required_level
        FROM stu st
        CROSS JOIN req r
      ),
      filled AS (
        SELECT
          p.student_id,
          p.skill_id,
          p.required_level,
          COALESCE(ss.level, 0) AS level_have
        FROM pairs p
        LEFT JOIN student_skill ss
          ON ss.student_id = p.student_id
         AND ss.skill_id   = p.skill_id
      )
      SELECT
        f.skill_id,
        sk.name_th,
        sk.name_en,
        sk.skill_type,
        /* หน่วยที่ขาด */
        ( SUM(f.required_level)
          - SUM(LEAST(f.level_have, f.required_level))
        )::int                                 AS units_missing,
        /* % ต่อ skill */
        ROUND(
          SUM(LEAST(f.level_have, f.required_level))::decimal
          / NULLIF(SUM(f.required_level), 0) * 100,
          2
        )                                      AS percent,
        MAX(f.required_level)                  AS required_level,
        COUNT(DISTINCT f.student_id)::int      AS total_students,   -- 👈 cast
        SUM(LEAST(f.level_have, f.required_level))::int AS units_have -- 👈 cast
      FROM filled f
      JOIN skill sk ON sk.id = f.skill_id
      GROUP BY f.skill_id, sk.name_th, sk.name_en, sk.skill_type
      ORDER BY sk.name_en
      `,
      [curriculumId],
    );
    return rows;
  }, 'Matrix query failed');

/* ---------------------------------------------------------------------------
 * Curriculum progress
 * -------------------------------------------------------------------------*/
export const getCurriculumProgress = async (
  curriculumId: UUIDTypes,
): Promise<CurriculumProgress> => {
  const matrix = await getCurriculumSkillMatrix(curriculumId);
  if (matrix.length === 0) throw new Error('Curriculum not found or no skills');

  const totalStudents = matrix[0].total_students; // number (cast แล้ว)
  const totalRequiredUnits = matrix.reduce(
    (sum, r) => sum + r.required_level * totalStudents,
    0,
  );
  const totalHaveUnits = matrix.reduce((sum, r) => sum + r.units_have, 0);

  const overallPercent = totalRequiredUnits
    ? Math.round((totalHaveUnits / totalRequiredUnits) * 100)
    : 0;

  return {
    curriculum_id: curriculumId,
    total_students: totalStudents,
    overall_percent: overallPercent,
    gaps: matrix.map(
      ({ required_level: _rl, total_students: _ts, units_have: _uh, ...gap }) =>
        gap,
    ),
  };
};

/* ---------------------------------------------------------------------------
 * Student progress
 * -------------------------------------------------------------------------*/
export const getStudentProgress = (studentId: UUIDTypes): Promise<StudentProgress> =>
  safeQuery(async (c) => {
    /* 1) student record */
    const stuRes = await c.queryObject<Student>(
      `SELECT * FROM student WHERE id = $1`,
      [studentId],
    );
    if (stuRes.rows.length === 0) throw new Error('Student not found');
    const student = stuRes.rows[0];
    const curId = student.curriculum_id;

    /* 2) requirement + level */
    const { rows } = await c.queryObject<StudentSkillEntry>(
      `
      SELECT
        cs.skill_id,
        sk.name_th,
        sk.name_en,
        sk.skill_type,
        cs.required_level            AS level_required,
        COALESCE(ss.level, 0)        AS level_have
      FROM curriculum_skill cs
      JOIN skill sk ON sk.id = cs.skill_id
      LEFT JOIN student_skill ss
        ON ss.student_id = $1
       AND ss.skill_id   = cs.skill_id
      WHERE cs.curriculum_id = $2
      `,
      [studentId, curId],
    );

    /* 3) units + percent */
    const unitsRequired = rows.reduce((s, r) => s + r.level_required, 0);
    const unitsHave = rows.reduce(
      (s, r) => s + Math.min(r.level_have, r.level_required),
      0,
    );
    const percent = unitsRequired
      ? Math.round((unitsHave / unitsRequired) * 100)
      : 0;

    const group = (pred: (e: StudentSkillEntry) => boolean) =>
      rows
        .filter(pred)
        .reduce<{ hard: StudentSkillEntry[]; soft: StudentSkillEntry[] }>(
          (acc, cur) => {
            acc[cur.skill_type].push(cur);
            return acc;
          },
          { hard: [], soft: [] },
        );

    return {
      student,
      percent,
      units_have: unitsHave,
      units_required: unitsRequired,
      completed: group((e) => e.level_have >= e.level_required),
      partial: group(
        (e) => e.level_have > 0 && e.level_have < e.level_required,
      ),
      missing: group((e) => e.level_have === 0),
    };
  }, 'Get student progress failed');

/* ---------------------------------------------------------------------------
 * Student activity history
 * -------------------------------------------------------------------------*/
export const getStudentActivityHistory = (
  studentId: UUIDTypes,
): Promise<StudentActivityHistory[]> =>
  safeQuery(async (c) => {
    const { rows } = await c.queryObject<StudentActivityHistory>(
      `
      SELECT
        a.id           AS activity_id,
        a.name,
        a.event_date,
        a.description,
        json_agg(
          json_build_object(
            'skill_id', sk.id,
            'name_th',  sk.name_th,
            'name_en',  sk.name_en,
            'level',    ssl.level
          )
        ) AS skills
      FROM activity a
      JOIN student_skill_log ssl
        ON ssl.obtained_from_activity = a.id
      JOIN skill sk ON sk.id = ssl.skill_id
      WHERE ssl.student_id = $1
      GROUP BY a.id
      ORDER BY a.event_date DESC
      `,
      [studentId],
    );
    return rows;
  }, 'Get activity history failed');

/* ---------------------------------------------------------------------------
 * Professor → overview student skills
 * -------------------------------------------------------------------------*/
export const getProfessorStudentOverview = (
  professorId: UUIDTypes,
): Promise<ProfessorStudentOverview[]> =>
  safeQuery(async (c) => {
    const { rows } = await c.queryObject<ProfessorStudentOverview>(
      `
      WITH stu AS (
        SELECT s.*
        FROM student s
        JOIN professor_student ps ON ps.student_id = s.id
        WHERE ps.professor_id = $1
      ),
      req AS (
        SELECT cs.*
        FROM curriculum_skill cs
        JOIN stu ON stu.curriculum_id = cs.curriculum_id
      ),
      data_raw AS (
        SELECT
          stu.id,
          stu.full_name,
          stu.student_code,
          stu.year,
          cur.name     AS curriculum_name,
          sk.id        AS skill_id,
          sk.name_th,
          sk.name_en,
          req.required_level,
          COALESCE(ss.level, 0)        AS level_have,
          CASE
            WHEN ss.level >= req.required_level THEN 1
            WHEN ss.level IS NULL              THEN 3
            ELSE 2
          END          AS status,
          ROW_NUMBER() OVER (
            PARTITION BY stu.id, sk.id
            ORDER BY ss.level DESC NULLS LAST
          ) AS rn
        FROM stu
        JOIN curriculum cur ON cur.id = stu.curriculum_id
        JOIN req ON req.curriculum_id = cur.id AND req.skill_id IS NOT NULL
        JOIN skill sk ON sk.id = req.skill_id
        LEFT JOIN student_skill ss
          ON ss.student_id = stu.id AND ss.skill_id = sk.id
      ),
      data AS (
        SELECT * FROM data_raw WHERE rn = 1
      )
      SELECT
        id,
        full_name,
        student_code,
        year,
        curriculum_name,
        ROUND(
          SUM(LEAST(level_have, required_level))::decimal
          / NULLIF(SUM(required_level), 0) * 100
        )::int                          AS percent,
        json_agg(
          json_build_object(
            'skill_id', skill_id,
            'name_th',  name_th,
            'name_en',  name_en,
            'status',   status
          ) ORDER BY name_th
        ) AS skills
      FROM data
      GROUP BY id, full_name, student_code, year, curriculum_name
      `,
      [professorId],
    );
    return rows;
  }, 'Get professor overview failed');


