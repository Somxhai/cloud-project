import { safeQuery } from '../../lib/utils.ts';
import type { Student,StudentActivityWithActivityInfo } from '../../type/app.ts';
import { UUIDTypes } from "../../lib/uuid.ts";

type CreateStudentInput = Omit<Student, 'id' | 'created_at' | 'updated_at'>;

export const createStudent = (data: CreateStudentInput): Promise<Student> => {
  return safeQuery(async (client) => {
    const result = await client.queryObject<Student>({
      text: `
        INSERT INTO student (
          user_id, student_code, full_name, faculty, major, year,
          curriculum_id, profile_picture_url, email, phone,
          gender, birth_date, line_id, student_status, is_active
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13, $14, $15
        )
        RETURNING *;
      `,
      args: [
        data.user_id,
        data.student_code,
        data.full_name,
        data.faculty,
        data.major,
        data.year,
        data.curriculum_id ?? null,
        data.profile_picture_url ?? null,
        data.email ?? null,
        data.phone ?? null,
        data.gender ?? null,
        data.birth_date ?? null,
        data.line_id ?? null,
        data.student_status,
        data.is_active,
      ],
    });

    return result.rows[0];
  }, 'Failed to create student');
};


// deno-lint-ignore no-explicit-any
export const getStudentFullDetail = (id: string): Promise<any> => {
  return safeQuery(async (client) => {
    const studentRes = await client.queryObject({
      text: `
        SELECT
          s.*,
          c.name AS curriculum_name,
          p.full_name AS professor_name
        FROM student s
        LEFT JOIN curriculum c ON s.curriculum_id = c.id
        LEFT JOIN professor_student ps ON ps.student_id = s.id
        LEFT JOIN professor p ON ps.professor_id = p.id
        WHERE s.id = $1
      `,
      args: [id],
    });

    const softSkills = await client.queryArray<[string, number]>(`
      SELECT s.name_th, ss.level
      FROM student_skill ss
      JOIN skill s ON s.id = ss.skill_id
      WHERE ss.student_id = $1 AND s.skill_type = 'soft'
    `, [id]);

    const hardSkills = await client.queryArray<[string, number]>(`
      SELECT s.name_th, ss.level
      FROM student_skill ss
      JOIN skill s ON s.id = ss.skill_id
      WHERE ss.student_id = $1 AND s.skill_type = 'hard'
    `, [id]);

    const student = studentRes.rows[0];
    return {
      ...(student ?? {}),
      Skill_S: softSkills.rows.map(([name, level]) => `${name}:${level}`),
      Skill_H: hardSkills.rows.map(([name, level]) => `${name}:${level}`),
    };
  }, 'Failed to get student full detail');
};


// deno-lint-ignore no-explicit-any
export const getCompletedActivitiesWithSkills = (studentId: string): Promise<any[]> => {
  return safeQuery(async (client) => {
    // deno-lint-ignore no-explicit-any
    const result = await client.queryObject<any>({
      text: `
        SELECT a.id, a.name, a.event_date, a.cover_image_url,
          COALESCE(json_agg(DISTINCT s.name_th) FILTER (WHERE s.id IS NOT NULL), '[]') AS skills
        FROM student_activity sa
        JOIN activity a ON sa.activity_id = a.id
        LEFT JOIN activity_skill ak ON ak.activity_id = a.id
        LEFT JOIN skill s ON s.id = ak.skill_id
        WHERE sa.student_id = $1 AND sa.status = 3
        GROUP BY a.id
        ORDER BY a.event_date DESC
      `,
      args: [studentId],
    });

    return result.rows;
  }, 'Failed to get completed activities with skills');
};

export const addOrUpdateStudentSkills = (
  studentId: string,
  skills: { skill_id: string; skill_level: number }[]
): Promise<void> => {
  return safeQuery(async (client) => {
    await client.queryObject('BEGIN');

    for (const skill of skills) {
      await client.queryObject(
        `
        INSERT INTO student_skill (student_id, skill_id, level)
        VALUES ($1, $2, $3)
        ON CONFLICT (student_id, skill_id)
        DO UPDATE SET
          level = LEAST(5, student_skill.level + $3),
          updated_at = CURRENT_TIMESTAMP;
        `,
        [studentId, skill.skill_id, skill.skill_level]
      );
    }

    await client.queryObject('COMMIT');
  }, 'Failed to add/update student skills');
};


export const getStudentActivitiesByStudent = (
  studentId: UUIDTypes
): Promise<StudentActivityWithActivityInfo[]> => {
  return safeQuery(async (client) => {
    const result = await client.queryObject<StudentActivityWithActivityInfo>({
      text: `
        SELECT sa.*, a.name AS activity_name, a.event_date
        FROM student_activity sa
        JOIN activity a ON sa.activity_id = a.id
        WHERE sa.student_id = $1
        ORDER BY a.event_date DESC
      `,
      args: [studentId],
    });
    return result.rows;
  }, 'Failed to fetch student activities');
};
