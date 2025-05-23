import { Hono } from "hono";
export const publicApp = new Hono();
import { checkStudentCodeExistsService } from "../database/service/student.ts";


publicApp.get("/check-code", async (c) => {
  const student_code = c.req.query("student_code");
  if (!student_code) {
    return c.json({ error: "Missing student_code" }, 400);
  }

  const exists = await checkStudentCodeExistsService(student_code);
  return c.json({ exists });
});