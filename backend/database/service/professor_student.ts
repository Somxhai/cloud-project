import { safeQuery } from "../../lib/utils.ts";
import { UUIDTypes } from "uuid";
import { Professor, Student, ProfessorStudent } from "../../type/app.ts";

export const getAllProfessors = async (): Promise<Professor[]> => {
  const query = `SELECT * FROM professor ORDER BY full_name`;
  return safeQuery<{ rows: Professor[] }>(
    (client) => client.query(query),
    "Failed to get all professors"
  ).then(res => res.rows);
};

export const getStudentsByProfessor = async (professorId: UUIDTypes): Promise<Student[]> => {
  const query = `
    SELECT st.*
    FROM professor_student ps
    JOIN student st ON st.id = ps.student_id
    WHERE ps.professor_id = $1
    ORDER BY st.full_name
  `;
  return safeQuery<{ rows: Student[] }>(
    (client) => client.query(query, [professorId]),
    "Failed to get students by professor"
  ).then(res => res.rows);
};

export const getStudentsWithoutProfessor = async (): Promise<Student[]> => {
  const query = `
    SELECT *
    FROM student
    WHERE id NOT IN (SELECT student_id FROM professor_student)
    ORDER BY full_name
  `;
  return safeQuery<{ rows: Student[] }>(
    (client) => client.query(query),
    "Failed to get students without professor"
  ).then(res => res.rows);
};

export const addStudentToProfessor = async (professorId: UUIDTypes, studentId: UUIDTypes): Promise<ProfessorStudent> => {
  const query = `
    INSERT INTO professor_student (professor_id, student_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  return safeQuery<{ rows: ProfessorStudent[] }>(
    (client) => client.query(query, [professorId, studentId]),
    "Failed to add student to professor"
  ).then(res => res.rows[0]);
};

export const removeStudentFromProfessor = async (professorId: UUIDTypes, studentId: UUIDTypes) => {
  const query = `
    DELETE FROM professor_student
    WHERE professor_id = $1 AND student_id = $2
  `;
  return safeQuery(
    (client) => client.query(query, [professorId, studentId]),
    "Failed to remove student from professor"
  );
};
