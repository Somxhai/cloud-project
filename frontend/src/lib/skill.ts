// lib/api/skill.ts
import type { Skill } from "@/types/models";
import { fetchAuthSession } from "@aws-amplify/auth";
import { getAuthHeaders } from "./utils/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
/*
async function getAuthHeaders() {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  if (!idToken) throw new Error("ไม่พบ token");
  return {
    Authorization: `Bearer ${idToken}`,
    "Content-Type": "application/json",
  };
}
*/
// src/lib/skill.ts


export async function getAllSkills(): Promise<Skill[]> {
    const res = await fetch(`${BASE_URL}/skill`, { cache: 'no-store' });
    if (!res.ok) throw new Error('โหลดทักษะไม่สำเร็จ');
    return await res.json();
}


export async function createSkill(payload: {
    name_th: string;
    name_en: string;
    description: string;
    skill_type: 'soft' | 'hard';
    is_active: boolean;
}): Promise<Skill> {
    const res = await fetch(`${BASE_URL}/skill`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('สร้างทักษะไม่สำเร็จ');
    return await res.json();
}


export async function updateSkill(skill: Skill): Promise<Skill> {
    const res = await fetch(`${BASE_URL}/skill/${skill.id}`, {
        method: 'PUT',
        headers: await getAuthHeaders(),
        body: JSON.stringify(skill),
    });
    if (!res.ok) throw new Error('อัปเดตทักษะไม่สำเร็จ');
    return await res.json();
}

export async function deleteSkill(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/skill/${id}`, {
        method: 'DELETE',
        headers: await getAuthHeaders(),
    });
    if (!res.ok) throw new Error('ลบทักษะไม่สำเร็จ');
}




export async function recalculateSkillsFromLogClient(studentId: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/skill/recalculate/${studentId}`, {
        method: 'POST',
        headers: await getAuthHeaders(),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Recalculation failed: ${text}`);
    }
}



// ดึงทักษะปัจจุบัน
export async function getStudentSkills(studentId: string) {
    const res = await fetch(`${BASE_URL}/skill/student/${studentId}`,
        {
            headers: await getAuthHeaders(),
        });
    if (!res.ok) throw new Error('โหลดทักษะไม่สำเร็จ');
    return res.json();
}

// ดึง log ทักษะ
export async function getStudentSkillLogs(studentId: string) {
    const res = await fetch(`${BASE_URL}/skill/student/${studentId}/log`, {
        headers: await getAuthHeaders(),
    });
    if (!res.ok) throw new Error('โหลด log ทักษะไม่สำเร็จ');
    return res.json();
}
