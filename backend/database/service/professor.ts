import { UUIDTypes } from "uuid";
import { safeQuery } from "../../lib/utils.ts";
import { ProfessorStudent,StudentWithSkills } from "../../type/app.ts";

// ฟังก์ชันนี้จะได้รายชื่อนักศึกษาที่อยู่ภายใต้การดูแลของอาจารย์
export const getAllStudentByProfessor = async (professorId: UUIDTypes) => {
  return await safeQuery<{ rows: ProfessorStudent[] }>(
    (client) =>
      client.query(
        `SELECT student_id FROM "professor_student" WHERE professor_id = $1;`,
        [professorId]
      ),
    "Failed to get all students by professor"
  ).then((res) => res.rows);
};



export const getStudentsWithSkillsByProfessor = async (
  professorId: UUIDTypes
): Promise<StudentWithSkills[]> => {
  const query = `
    SELECT 
      st.id,
      st.full_name,
      st.student_code,
      st.year,
      sk.name AS skill_name,
      ss.skill_level
    FROM professor_student ps
    JOIN student st ON ps.student_id = st.id
    LEFT JOIN student_skill ss ON st.id = ss.student_id
    LEFT JOIN skill sk ON ss.skill_id = sk.id
    WHERE ps.professor_id = $1
  `;

  const rows = await safeQuery<{
    rows: {
      id: string;
      full_name: string;
      student_code: string;
      year: number;
      skill_name: string | null;
      skill_level: number | null;
    }[];
  }>(
    (client) => client.query(query, [professorId]),
    "Failed to get students with skills by professor"
  ).then((res) => res.rows);

  // Group by student ID
  const map = new Map<string, StudentWithSkills>();

  for (const row of rows) {
    const key = row.id;

    if (!map.has(key)) {
      map.set(key, {
        id: row.id,
        full_name: row.full_name,
        student_code: row.student_code,
        year: row.year,
        skills: row.skill_name && row.skill_level !== null
          ? [`${row.skill_name}:${row.skill_level}`]
          : [],
      });
    } else if (row.skill_name && row.skill_level !== null) {
      map.get(key)!.skills.push(`${row.skill_name}:${row.skill_level}`);
    }
  }

  return Array.from(map.values());
};

