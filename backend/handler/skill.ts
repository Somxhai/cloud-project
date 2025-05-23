import { Hono } from "hono";
import {
  createSkill,
  getAllSkills,
  getStudentSkillLogs,
  getStudentSkills,
  recalculateSkillsFromLog,
  softDeleteSkill,
  updateSkill,
} from "../database/service/skill.ts";
import type { Skill } from "../type/app.ts";
import { UUIDTypes } from "../lib/uuid.ts";
import { cognitoMiddleware } from "../middleware.ts";
export const skillApp = new Hono();

skillApp.get("/", async (c) => {
  const skills = await getAllSkills();
  return c.json(skills);
});
// GET /skill
skillApp.use(cognitoMiddleware);

// POST /skill
skillApp.post("/", async (c) => {
  const body = await c.req.json();
  const data = body as Omit<
    Skill,
    "id" | "created_at" | "updated_at" | "is_active"
  >;
  const created = await createSkill(data);
  return c.json(created, 201);
});

// PUT /skill/:id
skillApp.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const data = body as Partial<Omit<Skill, "id" | "created_at" | "updated_at">>;
  const updated = await updateSkill(id, data);
  return c.json(updated);
});

// DELETE /skill/:id
skillApp.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await softDeleteSkill(id);
  return c.json({ success: true });
});

skillApp.post("/recalculate/:studentId", async (c) => {
  const studentId = c.req.param("studentId");
  await recalculateSkillsFromLog(studentId as UUIDTypes);
  return c.json({ success: true });
});

skillApp.get("/student/:id", async (c) => {
  const studentId = c.req.param("id");
  const data = await getStudentSkills(studentId as UUIDTypes);
  return c.json(data);
});

skillApp.get("/student/:id/log", async (c) => {
  const studentId = c.req.param("id");
  const data = await getStudentSkillLogs(studentId as UUIDTypes);
  return c.json(data);
});
