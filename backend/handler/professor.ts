import { Hono } from "hono";
import {
  getAllProfessors,
  getAllStudentByProfessor,
  getStudentsWithSkillsByProfessor,
  createProfessorByCognito,
} from "../database/service/professor.ts";

import {
  getStudentsByProfessor,
  getStudentsWithoutProfessor,
  addStudentToProfessor,
  removeStudentFromProfessor,
} from "../database/service/professor_student.ts";

import { cognitoMiddleware } from "../middleware.ts";
import { tryCatchService } from "../lib/utils.ts";

export const professorApp = new Hono<{
  Variables: {
    userSub: string | null;
  };
}>();

/* -----------------------------------------------------------
   ✅ ส่วนของอาจารย์ (public / protected)
----------------------------------------------------------- */

// GET: ดึง student_id ทั้งหมดภายใต้อาจารย์ (public)
professorApp.get("/:professorId/students", async (c) => {
  const professorId = c.req.param("professorId");
  const students = await tryCatchService(() => getAllStudentByProfessor(professorId));
  if (!Array.isArray(students)) {
    return c.json({ error: "Invalid data format" }, 500);
  }
  return c.json(students);
});

// GET: ดึง student พร้อม skills (public)
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

// POST: สร้างอาจารย์จาก Cognito
professorApp.post("/", async (c) => {
  const body = await c.req.json();
  const result = await tryCatchService(() => createProfessorByCognito(body));
  return c.json(result);
});

/* -----------------------------------------------------------
   ✅ ส่วนของ Staff สำหรับจัดการ professor-student
----------------------------------------------------------- */

// GET: รายชื่ออาจารย์ทั้งหมด
professorApp.get("/staff/professors", async (c) => {
  const data = await tryCatchService(() => getAllProfessors());
  return c.json(data);
});

// GET: รายชื่อนักศึกษาภายใต้ professor (ใช้ใน staff view)
professorApp.get("/staff/professors/:professorId/students", async (c) => {
  const professorId = c.req.param("professorId");
  const data = await tryCatchService(() => getStudentsByProfessor(professorId));
  return c.json(data);
});

// GET: นักศึกษาที่ยังไม่มีอาจารย์ที่ปรึกษา
professorApp.get("/staff/students/unassigned", async (c) => {
  const data = await tryCatchService(() => getStudentsWithoutProfessor());
  return c.json(data);
});

// POST: เพิ่มนักศึกษาเข้าอาจารย์ (staff ใช้)
professorApp.post("/staff/professors/:professorId/students/:studentId", async (c) => {
  const { professorId, studentId } = c.req.param();
  const data = await tryCatchService(() =>
    addStudentToProfessor(professorId, studentId)
  );
  return c.json(data);
});

// DELETE: ลบนักศึกษาออกจากอาจารย์ (staff ใช้)
professorApp.delete("/staff/professors/:professorId/students/:studentId", async (c) => {
  const { professorId, studentId } = c.req.param();
  await tryCatchService(() => removeStudentFromProfessor(professorId, studentId));
  return c.json({ success: true });
});
