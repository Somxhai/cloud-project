import {
    Activity,
    Skill,
    Student,
    StudentActivity,
    StudentWithSkills,
    ActivityWithSkills,
  } from '@/types/models';
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  
  /**
   * GET /students
   * ดึงนักศึกษาทั้งหมด
   */
  export async function getAllStudents(): Promise<Student[]> {
    const res = await fetch(`${BASE_URL}/student`, { cache: 'no-store' });
    if (!res.ok) throw new Error('ไม่สามารถดึงรายชื่อนักศึกษาได้');
    return res.json();
  }
  
  /**
   * GET /students/:studentId/activities
   * ดึงกิจกรรมที่นักศึกษาเข้าร่วม
   */
  export async function getStudentActivities(studentId: string): Promise<StudentActivity[]> {
    const res = await fetch(`${BASE_URL}/student/${studentId}/activities`, { cache: 'no-store' });
    if (!res.ok) throw new Error('ไม่สามารถดึงกิจกรรมของนักศึกษาได้');
    return res.json();
  }
  
  /**
   * GET /students/:studentId/skills
   * ดึงทักษะของนักศึกษาที่ได้จากกิจกรรม
   */
  export async function getStudentSkills(studentId: string): Promise<Skill[]> {
    const res = await fetch(`${BASE_URL}/student/${studentId}/skills`, { cache: 'no-store' });
    if (!res.ok) throw new Error('ไม่สามารถดึงทักษะของนักศึกษาได้');
    return res.json();
  }
  
  /**
   * POST /students/join
   * นักศึกษาเข้าร่วมกิจกรรม
   */
  export async function joinActivity(student_id: string, activity_id: string): Promise<StudentActivity> {
    const res = await fetch(`${BASE_URL}/student/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id, activity_id }),
    });
  
    if (!res.ok) throw new Error(await res.text() || 'เข้าร่วมกิจกรรมไม่สำเร็จ');
    return await res.json();
  }
  
  /**
   * GET /students/detail/:studentId
   * ดึงข้อมูลนักศึกษาพร้อมชื่ออาจารย์และ skills แบบ soft/hard
   */
  export async function getStudentFullDetail(studentId: string): Promise<
    Student & {
      professor_name: string | null;
      Skill_H: string[];
      Skill_S: string[];
    }
  > {
    const res = await fetch(`${BASE_URL}/student/detail/${studentId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('ไม่พบข้อมูลนักศึกษา');
    return res.json();
  }
  
  /**
   * GET /students/completed/:studentId
   * ดึงกิจกรรมที่เข้าร่วมแล้ว (status = 3) พร้อม skills
   */
  export async function getCompletedActivitiesWithSkills(studentId: string): Promise<ActivityWithSkills[]> {
    const res = await fetch(`${BASE_URL}/student/completed/${studentId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('ไม่สามารถดึงกิจกรรมที่สำเร็จได้');
    return res.json();
  }
  





  
  // ตรวจสอบว่านักศึกษาเคยลงทะเบียนกิจกรรมหรือยัง
  export async function getStudentActivityStatus(student_id: string, activity_id: string): Promise<StudentActivity | null> {
    const res = await fetch(`${BASE_URL}/student/activity-status?student_id=${student_id}&activity_id=${activity_id}`);
    if (!res.ok) return null;
    return await res.json();
  }


  export async function updateStudentActivityStatus(activity_id: string, student_id: string, status: number) {
    const res = await fetch(`${BASE_URL}/student/update-status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activity_id, student_id, status }),
    });
    if (!res.ok) throw new Error('Failed to update student activity status');
  }
  