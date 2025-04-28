import { Hono } from "hono";
import {
  getStudentActivities,
  getStudentSkills,
  getAllStudent,
} from "../database/service/student.ts";
import { cognitoMiddleware } from "../middleware.ts"; // ใช้ cognitoMiddleware
import { tryCatchService } from "../lib/utils.ts";

export const studentApp = new Hono<{
  Variables: {
    userSub: string | null;  // userSub มาจาก JWT
  };
}>();

// Public route: Get all students
studentApp.get("/", async (c) => {
  const students = await tryCatchService(() => getAllStudent());
  return c.json(students);
});

// Public route: Get activities of a student
studentApp.get("/:studentId/activities", async (c) => {
  const studentId = c.req.param("studentId");
  const activities = await tryCatchService(() => getStudentActivities(studentId));
  return c.json(activities);
});

// Public route: Get skills of a student
studentApp.get("/:studentId/skills", async (c) => {
  const studentId = c.req.param("studentId");
  const skills = await tryCatchService(() => getStudentSkills(studentId));
  return c.json(skills);
});

// Use cognitoMiddleware to protect routes
studentApp.use(cognitoMiddleware);

// You can add more protected routes below if needed
