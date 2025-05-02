import { assertEquals, assertArrayIncludes } from "jsr:@std/assert";
import { studentApp } from "../handler/student.ts";
import { loginUserInCognito } from "../lib/cognito.ts";

// Mock ข้อมูลจำลอง
interface Student {
  id: string;
  name: string;
}

const mockStudents: Student[] = [
  { id: "stu1", name: "Alice" },
  { id: "stu2", name: "Bob" },
];

const mockActivities = [
  { id: "act1", name: "Math Olympiad" },
];

const mockSkills = [
  { id: "sk1", name: "JavaScript" },
];

// Mock services
import * as _studentService from "../database/service/student.ts";

const mockStudentService = {
  getAllStudent: () => mockStudents,
  getStudentActivities: (_studentId: string) => mockActivities,
  getStudentSkills: (_studentId: string) => mockSkills,
};

// Replace the original service with the mock service in the application
interface StudentApp {
  studentService: typeof mockStudentService;
}

(studentApp as unknown as StudentApp).studentService = mockStudentService;

Deno.test("Student public routes", async (t) => {
  // ข้อมูลที่ใช้สำหรับล็อกอิน
  const username = "testuser";
  const password = "TestPassword123!";

  // สร้างผู้ใช้และรับ token ผ่าน Cognito
  const token = await loginUserInCognito(username, password);  if (!token) throw new Error("Login failed");

  const studentId = "stu1";

  await t.step("GET / - should return all students", async () => {
    const res = await studentApp.request("/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const students = await res.json();
    assertArrayIncludes(students.map((s: Student) => s.id), [mockStudents[0].id]);

    assertEquals(res.status, 200);
    const studentsData = await res.json();
    assertArrayIncludes(studentsData.map((s: Student) => s.id), [mockStudents[0].id]);
  });

  await t.step("GET /:studentId/activities - should return student activities", async () => {
    const res = await studentApp.request(`/${studentId}/activities`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    assertEquals(res.status, 200);
    const activities = await res.json();
    assertArrayIncludes(activities.map((a: { id: string; name: string }) => a.id), [mockActivities[0].id]);
  });

  await t.step("GET /:studentId/skills - should return student skills", async () => {
    const res = await studentApp.request(`/${studentId}/skills`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    assertEquals(res.status, 200);
    const skills = await res.json();
    assertArrayIncludes(skills.map((s: { id: string; name: string }) => s.id), [mockSkills[0].id]);
  });
});
