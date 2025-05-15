import {
  Activity,
  Skill,
  Student,
  StudentActivity,
  StudentWithSkills,
  ActivityWithSkills,
  Curriculum,
  CreateStudentInput,
  StudentActivityWithActivityInfo,
  StudentActivityStatus,
  StudentProgress,
  StudentActivityHistory,
} from '@/types/models';

import { fetchAuthSession } from '@aws-amplify/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

async function getAuthHeaders() {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  //if (!idToken) throw new Error('ไม่พบ token');
  return {
    Authorization: `Bearer ${idToken}`,
    'Content-Type': 'application/json',
  };
}

/**
 * GET /students
 * ดึงนักศึกษาทั้งหมด
 */
export async function getAllStudents(): Promise<Student[]> {
  const res = await fetch(`${BASE_URL}/student`, {
    cache: 'no-store',
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new Error('ไม่สามารถดึงรายชื่อนักศึกษาได้');
  return res.json();
}

/**
 * GET /students/:studentId/activities
 * ดึงกิจกรรมที่นักศึกษาเข้าร่วม
 */
export async function getStudentActivities(studentId: string): Promise<StudentActivity[]> {
  const res = await fetch(`${BASE_URL}/student/${studentId}/activities`, {
    cache: 'no-store',
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new Error('ไม่สามารถดึงกิจกรรมของนักศึกษาได้');
  return res.json();
}

/**
 * GET /students/:studentId/skills
 * ดึงทักษะของนักศึกษาที่ได้จากกิจกรรม
 */
export async function getStudentSkills(studentId: string): Promise<Skill[]> {
  const res = await fetch(`${BASE_URL}/student/${studentId}/skills`, {
    cache: 'no-store',
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new Error('ไม่สามารถดึงทักษะของนักศึกษาได้');
  return res.json();
}

/**
 * POST /students/join
 * นักศึกษาเข้าร่วมกิจกรรม

export async function joinActivity(student_id: string, activity_id: string): Promise<StudentActivity> {
  const res = await fetch(`${BASE_URL}/student/join`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ student_id, activity_id }),
  });

  if (!res.ok) throw new Error(await res.text() || 'เข้าร่วมกิจกรรมไม่สำเร็จ');
  return await res.json();
}
 */
/**
 * GET /students/detail/:studentId
 * ดึงข้อมูลนักศึกษาพร้อมชื่ออาจารย์และ skills แบบ soft/hard

export async function getStudentFullDetail(studentId: string): Promise<
  Student & {
    professor_name: string | null;
    Skill_H: string[];
    Skill_S: string[];
  }
> {
  const res = await fetch(`${BASE_URL}/student/detail/${studentId}`, {
    cache: 'no-store',
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new Error('ไม่พบข้อมูลนักศึกษา');
  return res.json();
}
 */
/**
 * GET /students/completed/:studentId
 * ดึงกิจกรรมที่เข้าร่วมแล้ว (status = 3) พร้อม skills

export async function getCompletedActivitiesWithSkills(studentId: string): Promise<ActivityWithSkills[]> {
  const res = await fetch(`${BASE_URL}/student/completed/${studentId}`, {
    cache: 'no-store',
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new Error('ไม่สามารถดึงกิจกรรมที่สำเร็จได้');
  return res.json();
}
 */
/**
 * ตรวจสอบว่านักศึกษาเคยลงทะเบียนกิจกรรมหรือยัง

export async function getStudentActivityStatus(student_id: string, activity_id: string): Promise<StudentActivity | null> {
  const res = await fetch(
    `${BASE_URL}/student/activity-status?student_id=${student_id}&activity_id=${activity_id}`,
    {
      headers: await getAuthHeaders(),
    }
  );
  if (!res.ok) return null;
  return await res.json();
}
 */
/**
 * PUT /student/update-status
 * เปลี่ยนสถานะการเข้าร่วมของนักศึกษา
 */
export async function updateStudentActivityStatus(activity_id: string, student_id: string, status: number) {
  const res = await fetch(`${BASE_URL}/student/update-status`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ activity_id, student_id, status }),
  });
  if (!res.ok) throw new Error('Failed to update student activity status');
}







/* ดึงรายละเอียดนักเรียนแบบเต็ม */
export async function getStudentFullDetail(studentId: string) {
  const res = await fetch(`${BASE_URL}/student/${studentId}/detail`);
  if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลนักศึกษา');
  return await res.json();
}

/* ดึงกิจกรรมที่เคยเข้าร่วม (แบบเสร็จสิ้น) */
export async function getCompletedActivitiesWithSkills(studentId: string) {
  const res = await fetch(`${BASE_URL}/student/${studentId}/activities/completed`);
  if (!res.ok) throw new Error('ไม่สามารถดึงกิจกรรมที่เสร็จสิ้น');
  return await res.json();
}



export const createStudent = async (data: CreateStudentInput): Promise<Student> => {
  const res = await fetch(`${BASE_URL}/student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('ไม่สามารถสร้างนักศึกษาได้');
  return res.json();
};

export const getAllCurricula = async (): Promise<Curriculum[]> => {
  const res = await fetch(`${BASE_URL}/curriculum`, { cache: 'no-store' });
  if (!res.ok) throw new Error('ไม่สามารถโหลดหลักสูตร');
  return res.json();
};






export async function getActivityDetail(id: string): Promise<ActivityWithSkills> {
  const res = await fetch(`${BASE_URL}/activity/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลกิจกรรม');
  return res.json();
}

export async function getStudentActivityStatus(studentId: string, activityId: string) {
  const res = await fetch(`${BASE_URL}/student-activity/status?studentId=${studentId}&activityId=${activityId}`);
  if (!res.ok) throw new Error('ไม่สามารถดึงสถานะได้');
  const data = await res.json();
  return {
    status: data.status,
    confirmation_status: data.confirmation_status ?? 0,
    feedback_submitted: data.feedback_submitted === true,
  };
}


export async function joinActivity(studentId: string, activityId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/student-activity/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: studentId, activity_id: activityId }),
  });
  if (!res.ok) throw new Error('ไม่สามารถลงทะเบียนเข้าร่วมกิจกรรม');
}



/*
export async function getMyActivities(studentId: string): Promise<StudentActivityWithActivityInfo[]> {
  const res = await fetch(`${BASE_URL}/student/my-activities?studentId=${studentId}`);
  if (!res.ok) throw new Error('โหลดกิจกรรมของฉันล้มเหลว');
  return res.json();
}
*/


export async function confirmAttendance(studentId: string, activityId: string, status: 1 | 2) {
  const res = await fetch(`${BASE_URL}/student-activity/${studentId}/confirm`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activityId, status }),
  });
  if (!res.ok) throw new Error('ไม่สามารถยืนยันได้');
  return await res.json();
}

/* ------------------------------------------------------------------ */
/* 1) ความคืบหน้าทักษะรายนักศึกษา                                    */
/*    GET  /progress/student/:id                                       */
/* ------------------------------------------------------------------ */
export async function getStudentProgress(
  studentId: string,
): Promise<StudentProgress> {
  const res = await fetch(`${BASE_URL}/progress/student/${studentId}`, {
    cache: 'no-store',
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new Error('โหลด progress นักศึกษาไม่สำเร็จ');
  return res.json();
}

/* ------------------------------------------------------------------ */
/* 2) ประวัติกิจกรรม + ทักษะที่ได้รับ                                 */
/*    GET  /progress/student/:id/activity-history                      */
/* ------------------------------------------------------------------ */
export async function getStudentActivityHistory(
  studentId: string,
): Promise<StudentActivityHistory[]> {
  const res = await fetch(
    `${BASE_URL}/progress/student/${studentId}/activity-history`,
    {
      cache: 'no-store',
      headers: await getAuthHeaders(),
    },
  );
  if (!res.ok) throw new Error('โหลดประวัติกิจกรรมไม่สำเร็จ');
  return res.json();
}


export async function getMyActivities(studentId: string): Promise<StudentActivityWithActivityInfo[]> {
  const res = await fetch(`${BASE_URL}/student/my-activities?studentId=${studentId}`);
  if (!res.ok) throw new Error('โหลดกิจกรรมของฉันล้มเหลว');
  return res.json();
}


export async function submitFeedback(studentId: string, activityId: string): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/student/${studentId}/activity/${activityId}/feedback`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'ไม่สามารถส่งแบบประเมินได้');
  }
}



export const checkStudentCodeExists = async (studentCode: string): Promise<boolean> => {
  const res = await fetch(`${BASE_URL}/student/check-code?student_code=${encodeURIComponent(studentCode)}`);
  if (!res.ok) throw new Error('Failed to check student code');
  const data = await res.json();
  return data.exists;
};
