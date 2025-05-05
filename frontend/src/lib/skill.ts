// lib/api/skill.ts
import type { Skill } from "@/types/models";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * GET /skills
 * ดึงทักษะทั้งหมด
 */
export async function getAllSkills(): Promise<Skill[]> {
  const res = await fetch(`${BASE_URL}/skill`, { cache: "no-store" });
  if (!res.ok) throw new Error("ไม่สามารถโหลดรายการทักษะได้");
  return res.json();
}

/**
 * POST /skills
 * สร้างทักษะใหม่
 */
export async function createSkill(skill: Skill): Promise<Skill> {
  const res = await fetch(`${BASE_URL}/skill`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(skill),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "ไม่สามารถสร้างทักษะได้");
  }

  return res.json();
}

/**
 * DELETE /skills/:id
 * ลบทักษะตาม ID
 */
export async function deleteSkill(skillId: string): Promise<Skill> {
  const res = await fetch(`${BASE_URL}/skill/${skillId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "ไม่สามารถลบทักษะได้");
  }

  return res.json();
}

/**
 * POST /skills/add-to-student
 * เพิ่มทักษะให้กับนักศึกษา
 */
export async function addSkillToStudent(skillId: string, studentId: string): Promise<Skill[]> {
  const res = await fetch(`${BASE_URL}/skill/add-to-student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skillId, studentId }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "ไม่สามารถเพิ่มทักษะให้นักศึกษาได้");
  }

  return res.json();
}


