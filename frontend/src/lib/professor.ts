import { ProfessorStudent, StudentWithSkills } from '@/types/models';
import { fetchAuthSession } from '@aws-amplify/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

async function getAuthHeaders() {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  if (!idToken) throw new Error('ไม่พบ token');
  return {
    Authorization: `Bearer ${idToken}`,
    'Content-Type': 'application/json',
  };
}

/**
 * GET /professor/:professorId/students
 * ดึง student_id ทั้งหมดที่อยู่ภายใต้ professorId
 */
export async function getStudentsByProfessor(professorId: string): Promise<ProfessorStudent[]> {
  const res = await fetch(`${BASE_URL}/professor/${professorId}/students`, {
    cache: 'no-store',
    headers: await getAuthHeaders(), // ✅ แนบ token
  });

  if (!res.ok) throw new Error('ไม่สามารถดึงรายชื่อนักศึกษาจากอาจารย์ได้');
  return res.json();
}

/**
 * GET /professor/:professorId/students/with-skills
 * ดึงรายชื่อนักศึกษา พร้อม skill name และ level
 */
export async function getStudentsWithSkillsByProfessor(professorId: string): Promise<StudentWithSkills[]> {
  const res = await fetch(`${BASE_URL}/professor/${professorId}/students/with-skills`, {
    cache: 'no-store',
    headers: await getAuthHeaders(), // ✅ แนบ token
  });

  if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลนักศึกษาพร้อม skill ได้');
  return res.json();
}


export async function getStudentsWithSkillsSummaryByProfessor(professorId: string) {
  const res = await fetch(`${BASE_URL}/professor/${professorId}/students/skills`);
  if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลนักศึกษาในที่ปรึกษา');
  return await res.json();
}

export async function createProfessor(data: {
  user_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  department?: string;
  faculty?: string;
  position?: string;
  profile_picture_url?: string;
}) {
  const res = await fetch(`${BASE_URL}/professor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('ไม่สามารถเพิ่มอาจารย์ได้');
  return await res.json();
}

export async function getProfessorById(professorId: string) {
  const res = await fetch(`${BASE_URL}/professor/${professorId}`);
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลอาจารย์');
  return await res.json();
}
