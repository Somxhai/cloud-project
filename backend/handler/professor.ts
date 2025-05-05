import { Hono } from "hono";
import {
  getAllStudentByProfessor,
  getStudentsWithSkillsByProfessor,
} from "../database/service/professor.ts";
import { cognitoMiddleware } from "../middleware.ts"; // ใช้ cognitoMiddleware
import { tryCatchService } from "../lib/utils.ts";

export const professorApp = new Hono<{
  Variables: {
    userSub: string | null;  // userSub มาจาก JWT
  };
}>();

// Public route: Get all students assigned to a professor
professorApp.get("/:professorId/students", async (c) => {
  const professorId = c.req.param("professorId");
  const students = await tryCatchService(() => getAllStudentByProfessor(professorId));
  if (!Array.isArray(students)) {
    return c.json({ error: "Invalid data format" }, 500);
  }
  return c.json(students);
});

// Use cognitoMiddleware to protect routes
//professorApp.use(cognitoMiddleware);


professorApp.get("/:professorId/students/with-skills", async (c) => {
  const professorId = c.req.param("professorId");
  const result = await tryCatchService(() =>
    getStudentsWithSkillsByProfessor(professorId)
  );
  if (!Array.isArray(result)) {
    return c.json({ error: "Invalid data format" }, 500);
  }
  return c.json(result);
});