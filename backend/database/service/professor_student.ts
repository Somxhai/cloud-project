import { safeQuery } from "../../lib/utils.ts";
import { UUIDTypes } from "../../lib/uuid.ts";
import type { Professor, Student, ProfessorStudent } from "../../type/app.ts";

/** ดึงอาจารย์ทั้งหมด */
export const getAllProfessors = async (): Promise<Professor[]> => {
  return await safeQuery(async (client) => {
    const result = await client.queryObject<Professor>(
      `SELECT * FROM professor ORDER BY full_name`
    );
    return result.rows;
  }, "Failed to get all professors");
};

/** ดึงนักศึกษาที่อยู่ภายใต้ professorId */
export const getStudentsByProfessor = async (professorId: UUIDTypes): Promise<Student[]> => {
  return await safeQuery(async (client) => {
    const result = await client.queryObject<Student>({
      text: `
        SELECT st.*
        FROM professor_student ps
        JOIN student st ON st.id = ps.student_id
        WHERE ps.professor_id = $1
        ORDER BY st.full_name
      `,
      args: [professorId],
    });
    return result.rows;
  }, "Failed to get students by professor");
};

/** ดึงนักศึกษาที่ยังไม่ถูกผูกกับอาจารย์ */
export const getStudentsWithoutProfessor = async (): Promise<Student[]> => {
  return await safeQuery(async (client) => {
    const result = await client.queryObject<Student>({
      text: `
        SELECT *
        FROM student
        WHERE id NOT IN (SELECT student_id FROM professor_student)
        ORDER BY full_name
      `,
    });
    return result.rows;
  }, "Failed to get students without professor");
};

/** ผูกนักศึกษากับอาจารย์ */
export const addStudentToProfessor = async (
  professorId: UUIDTypes,
  studentId: UUIDTypes,
): Promise<ProfessorStudent> => {
  return await safeQuery(async (client) => {
    const result = await client.queryObject<ProfessorStudent>({
      text: `
        INSERT INTO professor_student (professor_id, student_id)
        VALUES ($1, $2)
        RETURNING *;
      `,
      args: [professorId, studentId],
    });
    return result.rows[0];
  }, "Failed to add student to professor");
};

/** ยกเลิกความสัมพันธ์ระหว่างนักศึกษาและอาจารย์ */
export const removeStudentFromProfessor = async (
  professorId: UUIDTypes,
  studentId: UUIDTypes,
): Promise<void> => {
  await safeQuery(async (client) => {
    await client.queryObject({
      text: `
        DELETE FROM professor_student
        WHERE professor_id = $1 AND student_id = $2
      `,
      args: [professorId, studentId],
    });
  }, "Failed to remove student from professor");
};
