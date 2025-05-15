import { safeQuery } from '../../lib/utils.ts';
import { Professor } from '../../type/app.ts';
import { UUIDTypes } from '../../lib/uuid.ts';

export const getStudentsWithSkillComparison = async (professorId: string): Promise<any[]> => {
  return await safeQuery(async (client) => {
    const students = await client.queryObject<{
      id: string;
      full_name: string;
      student_code: string;
      year: number;
      curriculum_id: string | null;
    }>(`
      SELECT s.id, s.full_name, s.student_code, s.year, s.curriculum_id
      FROM professor_student ps
      JOIN student s ON ps.student_id = s.id
      WHERE ps.professor_id = $1
    `, [professorId]);

    const result: {
      id: string;
      full_name: string;
      student_code: string;
      year: number;
      curriculum_id: string | null;
      skills_have: string[];
      skills_missing: string[];
    }[] = [];

    for (const stu of students.rows) {
      const skillsHaveRes = await client.queryArray<[string]>(
        `SELECT sk.name_th FROM student_skill ss JOIN skill sk ON ss.skill_id = sk.id WHERE ss.student_id = $1`,
        [stu.id]
      );
      const skillsHave = skillsHaveRes.rows.map(([s]) => s);

      const skillsMissingRes = await client.queryArray<[string]>(
        `
        SELECT sk.name_th
        FROM curriculum_skill cs
        JOIN skill sk ON sk.id = cs.skill_id
        WHERE cs.curriculum_id = $1
        AND NOT EXISTS (
          SELECT 1 FROM student_skill ss
          WHERE ss.student_id = $2 AND ss.skill_id = cs.skill_id
        )
        `,
        [stu.curriculum_id, stu.id]
      );
      const skillsMissing = skillsMissingRes.rows.map(([s]) => s);

      result.push({
        ...stu,
        skills_have: skillsHave,
        skills_missing: skillsMissing,
      });
    }

    return result;
  }, 'Failed to get student skill summary');
};



export const createProfessor = async (
  data: Omit<Professor, 'created_at' | 'updated_at' | 'is_active'>
): Promise<Professor> => {
  return await safeQuery(async (client) => {
    const result = await client.queryObject<Professor>({
      text: `
        INSERT INTO professor (
          id, user_id, full_name, email, phone, department,
          faculty, position, profile_picture_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
      `,
      args: [
        data.id,
        data.user_id,
        data.full_name,
        data.email ?? null,
        data.phone ?? null,
        data.department ?? null,
        data.faculty ?? null,
        data.position ?? null,
        data.profile_picture_url ?? null,
      ],
    });

    return result.rows[0];
  }, 'Failed to create professor');
};


export const getAllProfessors = async (): Promise<Professor[]> => {
  const query = `
    SELECT * FROM professor
    ORDER BY full_name;
  `;

  return await safeQuery<{ rows: Professor[] }>(
    (client) => client.queryObject(query),
    "Failed to get all professors"
  ).then((res) => res.rows);
};


export const getProfessorById = async (id: string): Promise<Professor | null> => {
  return await safeQuery(async (client) => {
    const res = await client.queryObject<Professor>({
      text: 'SELECT * FROM professor WHERE id = $1',
      args: [id],
    });
    return res.rows[0] ?? null;
  }, 'Failed to get professor');
};



export const getProfessorByUserId = async (userId: UUIDTypes) => {
  const query = `
    SELECT * FROM professor WHERE id = $1 LIMIT 1;
  `;
  return await safeQuery<{ rows: Professor[] }>(
    (client) => client.queryObject(query, [userId]),
    "Failed to get professor profile"
  ).then(res => res.rows[0]);
};