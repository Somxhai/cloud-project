import { UUIDTypes } from "uuid";
import { safeQuery } from "../../lib/utils.ts";
import { Skill } from "../../type/app.ts";

// ฟังก์ชันนี้จะเพิ่มทักษะให้กับนักศึกษา
export const addSkillToStudent = async (skillId: UUIDTypes, studentId: UUIDTypes) => {
  const query = `
    INSERT INTO "student_skill" (skill_id, student_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  return await safeQuery<{ rows: Skill[] }>(
    (client) => client.query(query, [skillId, studentId]),
    "Failed to add skill to student"
  ).then((res) => res.rows);
};

// ฟังก์ชันนี้จะได้รายการทักษะทั้งหมด
export const getAllSkill = async () => {
  return await safeQuery<{ rows: Skill[] }>(
    (client) =>
      client.query(
        `SELECT * FROM "skill" ORDER BY name;`,
      ),
    "Failed to get all skills"
  ).then((res) => res.rows);;
};

// ฟังก์ชันสำหรับการสร้างทักษะใหม่
export const createSkill = async (skill: Skill) => {
  const query = `
    INSERT INTO "skill" (name, skill_type)
    VALUES ($1, $2)
    RETURNING *;
  `;
  return await safeQuery<{ rows: Skill[] }>(
    (client) => client.query(query, [skill.name, skill.skill_type]),
    "Failed to create skill"
  ).then((res) => res.rows);;
};

// ฟังก์ชันสำหรับลบทักษะ
export const deleteSkill = async (skillId: UUIDTypes) => {
  const query = `
    DELETE FROM "skill"
    WHERE id = $1
    RETURNING *;
  `;
  return await safeQuery<{ rows: Skill[] }>(
    (client) => client.query(query, [skillId]),
    "Failed to delete skill"
  ).then((res) => res.rows);
};
