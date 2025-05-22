// const BASE_URL =
// 	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

import { StudentDetail, ProfessorDetail } from "@/types/models";
import { getAuthHeaders } from "./utils/auth";
export async function createStudent(student: {
	id: string;
	user_id: string;
	student_code: string;
	full_name: string;
	faculty: string;
	major: string;
	year: number;
}) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/student`, {
		method: "POST",
		headers: await getAuthHeaders(),
		body: JSON.stringify(student),
	});
	if (!res.ok) throw new Error("Failed to create student");
	return res.json();
}

export async function createProfessor(professor: {
	id: string;
	user_id: string;
	full_name: string;
}) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/professor`,
		{
			method: "POST",
			headers: await getAuthHeaders(),
			body: JSON.stringify(professor),
		}
	);
	if (!res.ok) throw new Error("Failed to create professor");
	return res.json();
}

export async function getStudentProfile(
	userId: string
): Promise<StudentDetail> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/student/profile/${userId}`,
		{
			headers: await getAuthHeaders(),
		}
	);
	if (!res.ok) {
		const text = await res.text();
		console.error("API error:", res.status, text);
		throw new Error(text || "Unknown error");
	}

	// ✅ แก้ตรงนี้
	return await res.json();
}

export async function getProfessorProfile(
	userId: string
): Promise<ProfessorDetail> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/professor/profile/${userId}`,
		{
			headers: await getAuthHeaders(),
		}
	);
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}

export async function deleteCognitoUser(username: string): Promise<void> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/cognito/delete-user`,
		{
			method: "POST",
			headers: await getAuthHeaders(),
			body: JSON.stringify({ username }),
		}
	);

	if (!res.ok) {
		const { error } = await res.json();
		throw new Error(error || "ลบผู้ใช้ไม่สำเร็จ");
	}
}
