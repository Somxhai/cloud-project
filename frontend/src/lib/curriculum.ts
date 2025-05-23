// src/lib/curriculum.ts

import {
	Curriculum,
	CurriculumDetail,
	CurriculumSkillInput,
	Skill,
	CurriculumProgress,
} from "@/types/models";
import { getAuthHeaders } from "./utils/auth";

// const BASE_URL =
// 	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/* ------------------------------ ดึงรายการหลักสูตรทั้งหมด ------------------------------ */
// GET /curriculum
export async function getCurricula(): Promise<Curriculum[]> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/curriculum`,
		{ cache: "no-store" }
	);
	if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลหลักสูตร");
	return await res.json();
}

/* ------------------------------ ดึงรายละเอียดหลักสูตร ------------------------------ */
// GET /curriculum/:id
export async function getCurriculumDetail(
	id: string
): Promise<CurriculumDetail> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/curriculum/${id}`,
		{ cache: "no-store" }
	);
	if (!res.ok) throw new Error("ไม่สามารถดึงรายละเอียดหลักสูตร");
	return await res.json();
}

/* ------------------------------ ลบหลักสูตร ------------------------------ */
// DELETE /curriculum/:id
export async function deleteCurriculum(id: string): Promise<void> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/curriculum/${id}`,
		{
			method: "DELETE",
			headers: await getAuthHeaders(),
		}
	);
	if (!res.ok) throw new Error("ไม่สามารถลบหลักสูตร");
}

/* ------------------------------ แก้ไขทักษะในหลักสูตร ------------------------------ */
// PUT /curriculum/:id/skills
export async function updateCurriculumSkills(
	id: string,
	skills: CurriculumSkillInput[]
): Promise<void> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/curriculum/${id}/skills`,
		{
			method: "PUT",
			headers: await getAuthHeaders(),
			body: JSON.stringify(skills), // ✅ แก้ตรงนี้
		}
	);
	if (!res.ok) throw new Error("ไม่สามารถอัปเดตทักษะในหลักสูตร");
}

/* ------------------------------ สร้างหลักสูตรใหม่ ------------------------------ */
// POST /curriculum
export async function createCurriculum(payload: {
	name: string;
	description?: string;
}): Promise<Curriculum> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/curriculum`,
		{
			method: "POST",
			headers: await getAuthHeaders(),
			body: JSON.stringify(payload),
		}
	);
	if (!res.ok) throw new Error("ไม่สามารถสร้างหลักสูตรใหม่");
	return await res.json();
}

/* ------------------------------ ดึงทักษะทั้งหมด ------------------------------ */
// GET /skill
export async function getAllSkills(): Promise<Skill[]> {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/skill`, {
		cache: "no-store",
	});
	if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลทักษะ");
	return await res.json();
}

export async function getCurriculumSkills(
	curriculumId: string
): Promise<CurriculumSkillInput[]> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/curriculum/${curriculumId}/skills`
	);
	if (!res.ok) throw new Error("โหลดทักษะของหลักสูตรไม่สำเร็จ");
	return res.json();
}

export async function getCurriculumProgress(
	id: string
): Promise<CurriculumProgress> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/progress/curriculum/${id}`,
		{
			headers: await getAuthHeaders(),
			cache: "no-store",
		}
	);
	if (!res.ok) throw new Error("โหลด progress หลักสูตรไม่สำเร็จ");
	return res.json();
}
