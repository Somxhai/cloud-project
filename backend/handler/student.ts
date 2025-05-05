import { Hono } from "hono";
import {
  getStudentActivities,
  getStudentSkills,
  getAllStudent,
  getStudentActivityStatus,
  updateStudentActivityStatus
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
//studentApp.use(cognitoMiddleware);

// You can add more protected routes below if needed

import { joinActivity } from "../database/service/student.ts";

studentApp.post("/join", async (c) => {
  const { student_id, activity_id } = await c.req.json();
  const result = await tryCatchService(() => joinActivity(student_id, activity_id));
  return c.json(result);
});

import { getStudentFullDetail } from "../database/service/student.ts";

studentApp.get("/detail/:studentId", async (c) => {
  const studentId = c.req.param("studentId");
  const result = await tryCatchService(() => getStudentFullDetail(studentId));
  return c.json(result);
});


import { getCompletedActivitiesWithSkills } from "../database/service/student.ts";

studentApp.get("/completed/:studentId", async (c) => {
  const studentId = c.req.param("studentId");
  const result = await tryCatchService(() => getCompletedActivitiesWithSkills(studentId));
  return c.json(result);
});


studentApp.get("/activity-status", async (c) => {
  const student_id = c.req.query("student_id");
  const activity_id = c.req.query("activity_id");

  if (!student_id || !activity_id) {
    return c.text("Missing student_id or activity_id", 400);
  }

  const result = await tryCatchService(() =>
    getStudentActivityStatus(student_id, activity_id)
  );
  return c.json(result ?? null);
});


studentApp.put("/update-status", async (c) => {
  const { activity_id, student_id, status } = await c.req.json();
  if (!activity_id || !student_id || status == null) {
    return c.text("Missing parameters", 400);
  }

  const result = await tryCatchService(() =>
    updateStudentActivityStatus(activity_id, student_id, status)
  );

  return c.json(result);
});
