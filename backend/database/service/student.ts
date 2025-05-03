import { UUIDTypes } from "uuid";
import { safeQuery } from "../../lib/utils.ts";
import { Student } from "../../type/app.ts";

// ฟังก์ชันนี้จะได้กิจกรรมที่นักศึกษาเข้าร่วม
export const getStudentActivities = async (studentId: UUIDTypes) => {
  return await safeQuery<{ rows: Student[] }>(
    (client) =>
      client.query(
        `SELECT * FROM "student_activity" WHERE student_id = $1 ORDER BY participated_at;`,
        [studentId]
      ),
    "Failed to get student activities"
  ).then((res) => res.rows);
};

// ฟังก์ชันนี้จะได้ทักษะของนักศึกษาจากกิจกรรมที่เคยเข้าร่วม
export const getStudentSkills = async (studentId: UUIDTypes) => {
  return await safeQuery<{ rows: Student[] }>(
    (client) =>
      client.query(
        `SELECT skill.* FROM "skill" JOIN "activity_skill" ON skill.id = activity_skill.skill_id
         JOIN "student_activity" ON student_activity.activity_id = activity_skill.activity_id
         WHERE student_activity.student_id = $1;`,
        [studentId]
      ),
    "Failed to get student skills"
  ).then((res) => res.rows);
};

// ฟังก์ชันนี้จะได้ข้อมูลทั้งหมดของนักศึกษา
export const getAllStudent = async () => {
  return await safeQuery<{ rows: Student[] }>(
    (client) =>
      client.query(
        `SELECT * FROM "student";`
      ),
    "Failed to get all students"
  ).then((res) => res.rows);
};

// ฟังก์ชันนี้จะสร้างนักศึกษาใหม่
export const createStudent = async (userId: UUIDTypes, faculty: string, major: string, year: number) => {
  const query = `
    INSERT INTO "student" (user_id, faculty, major, year)
    VALUES ($1, $2, $3, $4)
    RETURNING *;  // Returns the newly created student
  `;
  
  const values = [userId, faculty, major, year];
  
  return await safeQuery<{ rows: Student[] }>(
    (client) => client.query(query, values),
    "Failed to create student"
  ).then((res) => res.rows[0]);  // Return the newly created student (first row of result)
};
