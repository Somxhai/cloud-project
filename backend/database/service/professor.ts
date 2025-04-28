import { UUIDTypes } from "uuid";
import { safeQuery } from "../../lib/utils.ts";
import { ProfessorStudent } from "../../type/app.ts";

// ฟังก์ชันนี้จะได้รายชื่อนักศึกษาที่อยู่ภายใต้การดูแลของอาจารย์
export const getAllStudentByProfessor = async (professorId: UUIDTypes) => {
  return await safeQuery<ProfessorStudent[]>(
    (client) =>
      client.query(
        `SELECT student_id FROM "professor_student" WHERE professor_id = $1;`,
        [professorId]
      ),
    "Failed to get all students by professor"
  );
};
