import {
  assertEquals,
  assertExists,
} from "jsr:@std/assert";
import { professorApp } from "../handler/professor.ts";
import { loginUserInCognito } from "../lib/cognito.ts";
import { ProfessorStudent } from "../type/app.ts";

Deno.test("Professor routes", async (t) => {
  const username = "testuser";
  const password = "TestPassword123!";
  const token = await loginUserInCognito(username, password);
  if (!token) throw new Error("Login failed");

  // ป้อน professorId ที่คุณใช้ทดสอบได้จริงในฐานข้อมูล
  const professorId = "ee5e351e-b213-4f1c-a1cc-0b70c85f4032";
  
  await t.step("GET /:professorId/students - fetch assigned students", async () => {
    const res = await professorApp.request(`/${professorId}/students`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    assertEquals(res.status, 200);

    const students: ProfessorStudent[] = await res.json();

    // ตัวอย่าง assertion พื้นฐาน
    assertExists(students);
    if (students.length > 0) {
      assertExists(students[0].student_id);
    }
  });

  await t.step("GET /:professorId/students - invalid professor ID returns empty or handled", async () => {
    const res = await professorApp.request(`/nonexistent-id/students`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // สมมุติว่า API ของคุณส่ง 200 พร้อม array ว่าง หรือ 500 ถ้ารูปแบบผิด
    assertEquals([200, 500].includes(res.status), true);
  });
});
