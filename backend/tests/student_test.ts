import {
  assertEquals,
  assertArrayIncludes,
  assertExists,
  assert,
} from "jsr:@std/assert";
import { safeQuery } from "../lib/utils.ts"; // Assuming you have a safeQuery function for database operations
import { studentApp } from "../handler/student.ts";
import { loginUserInCognito } from "../lib/cognito.ts";
import { Student } from "../type/app.ts"; // ถ้ามี type `Student`

const sampleStudent = {
  id: crypto.randomUUID(), // or generate manually if you need a fixed ID
  user_id: crypto.randomUUID(),
  faculty: "Engineering",
  major: "Computer Science",
  year: 2,
};

Deno.test("Student routes", async (t) => {
  // Insert test student into the database
  await safeQuery(
    async (client) => {
      await client.queryObject(
        `INSERT INTO "student" (id, user_id, faculty, major, year) VALUES ($1, $2, $3, $4, $5)`,
        [sampleStudent.id, sampleStudent.user_id, sampleStudent.faculty, sampleStudent.major, sampleStudent.year]
      );
    },
    "Failed to insert test student into the database"
  );

  const username = "testuser";
  const password = "TestPassword123!";
  const token = await loginUserInCognito(username, password);
  if (!token) throw new Error("Login failed");

  let sampleStudentId = "ee5e351e-b213-4f1c-a1cc-0b70c85f4032"; // <-- Declare here

  await t.step("GET / - fetch all students", async () => {
    const res = await studentApp.request("/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    assertEquals(res.status, 200);
    const students: Student[] = await res.json();
    assertEquals(Array.isArray(students), true);
    assertExists(students[0]);

    sampleStudentId = students[0].id; // now it's safe to assign
  });

/*  await t.step("GET /:id/activities - fetch student activities", async () => {
    const res = await studentApp.request(`/${sampleStudentId}/activities`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    assertEquals(res.status, 200);
    const activities = await res.json();
    assert(Array.isArray(activities));
  });

  await t.step("GET /:id/skills - fetch student skills", async () => {
    const res = await studentApp.request(`/${sampleStudentId}/skills`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    assertEquals(res.status, 200);
    const skills = await res.json();
    assert(Array.isArray(skills));
  });

  await t.step("GET /invalid-id/skills - should return 400 or 500", async () => {
    const res = await studentApp.request(`/invalid-uuid/skills`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    assert([400, 500].includes(res.status));
  });*/
});
