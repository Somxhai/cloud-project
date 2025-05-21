import { Hono } from "hono";
import {
  confirmAttendanceStatus,
  getStudentActivityStatus,
  joinActivity,
  updateStudentAttendance
} from "../database/service/student_activity.ts";
import { UUIDTypes } from "../lib/uuid.ts";
import { cognitoMiddleware } from "../middleware.ts";
export const studentActivityApp = new Hono();

studentActivityApp.use(cognitoMiddleware);

/**
 * GET /student-activity/status?studentId=xxx&activityId=yyy
 * คืนค่า status ของนักศึกษาคนนั้นในกิจกรรมที่ระบุ
 */
studentActivityApp.get("/status", async (c) => {
  const studentId = c.req.query("studentId");
  const activityId = c.req.query("activityId");

  if (!studentId || !activityId) return c.text("Missing query parameters", 400);

  const result = await getStudentActivityStatus(studentId, activityId);
  return c.json(result);
});

/**
 * POST /student-activity/join
 * ลงทะเบียนกิจกรรม (status = 0)
 */
studentActivityApp.post("/join", async (c) => {
  const body = await c.req.json();
  const { student_id, activity_id } = body;

  if (!student_id || !activity_id) return c.text("Missing fields", 400);

  await joinActivity(student_id, activity_id);
  return c.text("Joined successfully");
});

studentActivityApp.put("/:studentId/confirm", async (c) => {
  const studentId = c.req.param("studentId");
  const { activityId, status } = await c.req.json();

  if (!activityId || ![1, 2].includes(status)) {
    return c.text("Invalid request payload", 400);
  }

  await confirmAttendanceStatus(
    studentId as UUIDTypes,
    activityId as UUIDTypes,
    status,
  );
  return c.json({ success: true });
});


studentActivityApp.post('/mark-attendance', async (c) => {
  const body = await c.req.json();
  const { student_id, activity_id, attended } = body;

  if (!student_id || !activity_id || typeof attended !== 'boolean') {
    return c.json({ error: 'ข้อมูลไม่ครบหรือไม่ถูกต้อง' }, 400);
  }

  try {
    await updateStudentAttendance(student_id, activity_id, attended);
    return c.json({ message: 'อัปเดตการเข้าร่วมกิจกรรมสำเร็จ' });
  } catch (err) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return c.json({ error: errorMessage }, 500);
  }
});