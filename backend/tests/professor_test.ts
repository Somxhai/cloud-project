import { assertEquals, assertArrayIncludes } from "jsr:@std/assert";
import { professorApp } from "../handler/professor.ts";
import { loginUserInCognito } from "../lib/cognito.ts"; // ใช้เหมือนกับ activity test
import { getAllStudentByProfessor } from "../database/service/professor.ts";

// mock database response (สามารถเปลี่ยนเป็น mock service ได้ตามความเหมาะสม)
interface Student {
  id: string;
  name: string;
}

const mockStudents: Student[] = [
  { id: "stu1", name: "Student A" },
  { id: "stu2", name: "Student B" },
];

// mock getAllStudentByProfessor
const originalGetAllStudentByProfessor = getAllStudentByProfessor;
(globalThis as { getAllStudentByProfessor?: (_id: string) => Promise<typeof mockStudents> }).getAllStudentByProfessor = (_id: string) => Promise.resolve(mockStudents);

Deno.test("Professor routes", async (t) => {
  // ข้อมูลที่ใช้สำหรับล็อกอิน
  const username = "testuser";
  const password = "TestPassword123!";

  // สร้างผู้ใช้และรับ token ผ่าน Cognito
  const token = await loginUserInCognito(username, password);

  if (!token) throw new Error("Login failed");

  const professorId = "prof123";

  await t.step("GET /:professorId/students - should return students", async () => {
    const res = await professorApp.request(`/${professorId}/students`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const students = await res.json();
    assertArrayIncludes(students.map((s: Student) => s.id), [mockStudents[0].id, mockStudents[1].id]);

    assertEquals(res.status, 200);
    assertArrayIncludes(students.map((s: Student) => s.id), [mockStudents[0].id, mockStudents[1].id]);
  });

  await t.step("GET /:professorId/students - should return 500 on invalid data", async () => {
    // จำลอง error (response ไม่ใช่ array)
    (globalThis as { getAllStudentByProfessor?: (_id: string) => Promise<unknown> }).getAllStudentByProfessor = () => Promise.resolve("not-an-array");

    const res = await professorApp.request(`/${professorId}/students`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    assertEquals(res.status, 500);
    const body = await res.json();
    assertEquals(body.error, "Invalid data format");

    // คืนค่าเดิมหลังทดสอบเสร็จ
    (globalThis as { getAllStudentByProfessor?: (_id: string) => Promise<Student[]> }).getAllStudentByProfessor = async (id: string) => {
      const professorStudents = await originalGetAllStudentByProfessor(id);
      return professorStudents.map((ps) => ({ id: ps.id, name: "Unknown" }));
    };
  });
});
