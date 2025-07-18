import { ProfessorStudent } from "@/types/models";
import { getAuthHeaders } from "./utils/auth";

// const BASE_URL =
// 	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * GET /professor/:professorId/students
 * ดึง student_id ทั้งหมดที่อยู่ภายใต้ professorId
 */
export async function getStudentsByProfessor(
	professorId: string
): Promise<ProfessorStudent[]> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/professor/${professorId}/students`,
		{
			cache: "no-store",
			headers: await getAuthHeaders(), // ✅ แนบ token
		}
	);

	if (!res.ok) throw new Error("ไม่สามารถดึงรายชื่อนักศึกษาจากอาจารย์ได้");
	return res.json();
}

/**
 * GET /professor/:professorId/students/with-skills
 * ดึงรายชื่อนักศึกษา พร้อม skill name และ level
 */
/*
export async function getStudentsWithSkillsByProfessor(professorId: string): Promise<StudentWithSkills[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/professor/${professorId}/students/with-skills`, {
    cache: 'no-store',
    headers: await getAuthHeaders(), // ✅ แนบ token
  });

  if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลนักศึกษาพร้อม skill ได้');
  return res.json();
}
*/

export async function getStudentsWithSkillsSummaryByProfessor(
	professorId: string
) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/professor/${professorId}/students/skills`,
		{
			headers: await getAuthHeaders(),
		}
	);
	if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลนักศึกษาในที่ปรึกษา");
	return await res.json();
}

export async function createProfessor(data: {
	id: string;
	user_id: string;
	full_name: string;
	email?: string;
	phone?: string;
	department?: string;
	faculty?: string;
	position?: string;
	profile_picture_url?: string;
}) {
	console.log("env", process.env.NEXT_PUBLIC_API_BASE_URL);
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/professor`,
		{
			method: "POST",
			headers: await getAuthHeaders(),
			body: JSON.stringify(data),
		}
	);
	if (!res.ok) throw new Error("ไม่สามารถเพิ่มอาจารย์ได้");
	return await res.json();
}

export async function getProfessorById(professorId: string) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/professor/${professorId}`,
		{
			headers: await getAuthHeaders(),
		}
	);
	if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลอาจารย์");
	return await res.json();
}

export async function getStudentsWithSkillsByProfessor(
	professorId: string
): Promise<ProfessorStudent[]> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/progress/professor/${professorId}/students`,
		{
			cache: "no-store",
			headers: await getAuthHeaders(),
		}
	);
	if (!res.ok) throw new Error("โหลดรายชื่อนักศึกษาไม่สำเร็จ");
	return res.json();
}
