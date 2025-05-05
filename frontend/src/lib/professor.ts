import { ProfessorStudent, StudentWithSkills } from '@/types/models';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * GET /professor/:professorId/students
 * ดึง student_id ทั้งหมดที่อยู่ภายใต้ professorId
 */
export async function getStudentsByProfessor(professorId: string): Promise<ProfessorStudent[]> {
  const res = await fetch(`${BASE_URL}/professor/${professorId}/students`, {
    cache: 'no-store',
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
  });

  if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลนักศึกษาพร้อม skill ได้');
  return res.json();
}
