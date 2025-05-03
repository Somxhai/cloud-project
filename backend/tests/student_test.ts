import {
  assertEquals,
  assertExists
} from "jsr:@std/assert";
import { studentApp } from "../handler/student.ts"; // ปรับ path ตามโปรเจกต์
import { Student, Activity, Skill } from "../type/app.ts"; // ถ้ามี type เหล่านี้
import { UUIDTypes } from "uuid";

Deno.test("Student routes", async (t) => {
  let testStudentId: UUIDTypes;

  await t.step("GET / - fetch all students", async () => {
    const res = await studentApp.request("/", {
      method: "GET",
    });

    assertEquals(res.status, 200);
    const students: Student[] = await res.json();

    assertEquals(Array.isArray(students), true);
    if (students.length === 0) {
      console.warn("⚠️ No students found. Add test data if needed.");
    } else {
      testStudentId = students[0].id;
      assertExists(testStudentId);
    }
  });

  await t.step("GET /:id/activities - fetch student's activities", async () => {
    if (!testStudentId) {
      console.warn("❌ Skipped activities test — no student found.");
      return;
    }

    const res = await studentApp.request(`/${testStudentId}/activities`, {
      method: "GET",
    });

    assertEquals(res.status, 200);
    const activities: Activity[] = await res.json();

    assertEquals(Array.isArray(activities), true);
  });

  await t.step("GET /:id/skills - fetch student's skills", async () => {
    if (!testStudentId) {
      console.warn("❌ Skipped skills test — no student found.");
      return;
    }

    const res = await studentApp.request(`/${testStudentId}/skills`, {
      method: "GET",
    });

    assertEquals(res.status, 200);
    const skills: Skill[] = await res.json();

    assertEquals(Array.isArray(skills), true);
  });

  await t.step("GET /non-existing-uuid/skills - should return 404 or empty", async () => {
    const fakeUUID = "00000000-0000-0000-0000-000000000000";
    const res = await studentApp.request(`/${fakeUUID}/skills`, {
      method: "GET",
    });
  
    // อาจได้ 404 หรือ array ว่าง (ขึ้นกับ logic ของคุณ)
    if (res.status === 404) {
      assertEquals(res.status, 404);
    } else {
      const skills = await res.json();
      assertEquals(Array.isArray(skills), true);
      assertEquals(skills.length, 0);
    }
  });
  
});
