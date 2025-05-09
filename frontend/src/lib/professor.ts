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
