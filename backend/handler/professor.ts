import { Hono } from "hono";
import { tryCatchService } from "../lib/utils.ts";
import {
  createProfessor,
  getAllProfessors,
  getProfessorById,
  getProfessorByUserId,
  getStudentsWithSkillComparison,
} from "../database/service/professor.ts";
import {
  addStudentToProfessor,
  getStudentsByProfessor,
  getStudentsWithoutProfessor,
  removeStudentFromProfessor,
} from "../database/service/professor_student.ts";
import { UUIDTypes } from "../lib/uuid.ts";
import { cognitoMiddleware } from "../middleware.ts";
export const professorApp = new Hono();

professorApp.get("/", (c) => {
  return tryCatchService(() => {
    return Promise.resolve(c.json({ message: "GET /professor" }));
  });
});

// GET: รายชื่ออาจารย์ทั้งหมด
professorApp.get("/staff/professors", async (c) => {
  const data = await tryCatchService(() => getAllProfessors());
  return c.json(data);
});
professorApp.use(cognitoMiddleware);

professorApp.get("/:id/students/skills", async (c) => {
  const professorId = c.req.param("id");
  const data = await getStudentsWithSkillComparison(professorId);
  return c.json(data);
});

professorApp.post("/", async (c) => {
  const body = await c.req.json();
  const newProfessor = await createProfessor(body);
  return c.json(newProfessor, 201);
});

/* -----------------------------------------------------------
   ✅ ส่วนของ Staff สำหรับจัดการ professor-student
----------------------------------------------------------- */

// GET: รายชื่อนักศึกษาภายใต้ professor (ใช้ใน staff view)
professorApp.get("/staff/professors/:professorId/students", async (c) => {
  const professorId = c.req.param("professorId");
  if (!/^[\w-]{36}$/.test(professorId)) {
    return c.json({ error: "Invalid professor ID format" }, 400);
  }
  const data = await tryCatchService(() =>
    getStudentsByProfessor(
      professorId as `${string}-${string}-${string}-${string}-${string}`,
    )
  );
  return c.json(data);
});

// GET: นักศึกษาที่ยังไม่มีอาจารย์ที่ปรึกษา
professorApp.get("/staff/students/unassigned", async (c) => {
  const data = await tryCatchService(() => getStudentsWithoutProfessor());
  return c.json(data);
});

// POST: เพิ่มนักศึกษาเข้าอาจารย์ (staff ใช้)
professorApp.post(
  "/staff/professors/:professorId/students/:studentId",
  async (c) => {
    const { professorId, studentId } = c.req.param();
    const data = await tryCatchService(() =>
      addStudentToProfessor(
        professorId as `${string}-${string}-${string}-${string}-${string}`,
        studentId as `${string}-${string}-${string}-${string}-${string}`,
      )
    );
    return c.json(data);
  },
);

// DELETE: ลบนักศึกษาออกจากอาจารย์ (staff ใช้)
professorApp.delete(
  "/staff/professors/:professorId/students/:studentId",
  async (c) => {
    const { professorId, studentId } = c.req.param();
    await tryCatchService(() =>
      removeStudentFromProfessor(
        professorId as `${string}-${string}-${string}-${string}-${string}`,
        studentId as `${string}-${string}-${string}-${string}-${string}`,
      )
    );
    return c.json({ success: true });
  },
);

professorApp.get("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await getProfessorById(id);
  return data ? c.json(data) : c.notFound();
});

professorApp.get("/profile/:userId", async (c) => {
  const userId = c.req.param("userId");
  if (!userId) return c.text("Missing user ID", 400);

  return await tryCatchService(() => getProfessorByUserId(userId as UUIDTypes))
    .then((data) => c.json(data));
});
