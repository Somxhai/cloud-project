import { UUIDTypes } from "uuid";
import { safeQuery } from "../../lib/utils.ts";
import { Skill } from "../../type/app.ts";

// ฟังก์ชันนี้จะเพิ่มทักษะให้กับนักศึกษา
export const addSkillToStudent = async (skillId: UUIDTypes, studentId: UUIDTypes) => {
  const query = `
    INSERT INTO "activity_skill" (activity_id, skill_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  return await safeQuery(
    (client) => client.query(query, [skillId, studentId]),
    "Failed to add skill to student"
  );
};

// ฟังก์ชันนี้จะได้รายการทักษะทั้งหมด
export const getAllSkill = async () => {
  return await safeQuery<Skill[]>(
    (client) =>
      client.query(
        `SELECT * FROM "skill" ORDER BY name;`
      ),
    "Failed to get all skills"
  );
};

// ฟังก์ชันสำหรับการสร้างทักษะใหม่
export const createSkill = async (skill: Skill) => {
  const query = `
    INSERT INTO "skill" (name, skill_type)
    VALUES ($1, $2)
    RETURNING *;
  `;
  return await safeQuery(
    (client) => client.query(query, [skill.name, skill.skill_type]),
    "Failed to create skill"
  );
};
