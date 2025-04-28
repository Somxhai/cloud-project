import { Hono } from "hono";
import {
  addSkillToStudent,
  getAllSkill,
  createSkill,
} from "../database/service/skill.ts";
import { cognitoMiddleware } from "../middleware.ts"; // ใช้ cognitoMiddleware
import { Skill } from "../type/app.ts";
import { tryCatchService } from "../lib/utils.ts";

export const skillApp = new Hono<{
  Variables: {
    userSub: string | null;  // userSub มาจาก JWT
  };
}>();

// Public route: Get all skills
skillApp.get("/", async (c) => {
  const skills = await tryCatchService(() => getAllSkill());
  return c.json(skills);
});

// Use cognitoMiddleware to protect routes
skillApp.use(cognitoMiddleware);

// Protected route: Add skill to a student
skillApp.post("/add-to-student", async (c) => {
  const { skillId, studentId } = await c.req.json();
  const result = await tryCatchService(() => addSkillToStudent(skillId, studentId));
  if (typeof result === "object" && result !== null) {
    return c.json(result);
  }
  return c.json({ error: "Invalid result" });
});

// Protected route: Create a new skill
skillApp.post("/", async (c) => {
  const skill: Skill = await c.req.json();
  const result = await tryCatchService(() => createSkill(skill)) as Skill | null;
  return c.json(result ?? { error: "Failed to create skill" });
});
