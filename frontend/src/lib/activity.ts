import {
  Activity,
  ActivityWithSkills,
  StudentActivityWithStudentInfo,
  ActivitySkill,
  ActivityEvaluation
} from '@/types/models';

import { fetchAuthSession } from '@aws-amplify/auth';

async function getAuthHeaders() {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  //if (!idToken) throw new Error('ไม่พบ token');
  return {
    Authorization: `Bearer ${idToken}`,
    'Content-Type': 'application/json',
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * GET /activities
 * ดึงกิจกรรมทั้งหมด
 */
export async function getAllActivities(): Promise<Activity[]> {
  const res = await fetch(`${BASE_URL}/activity`, {
    cache: 'no-store',
    headers: await getAuthHeaders(), // ✅ แนบ token
  });
  if (!res.ok) throw new Error('Failed to fetch activities');
  return res.json();
}

/**
 * GET /activities/:id
 * ดึงกิจกรรมตาม ID
 */


/**
 * POST /activities
 * สร้างกิจกรรมใหม่
 */
/**
 * POST /activity
 * สร้างกิจกรรมใหม่
 */
export const createActivity = async (data: {
  name: string;
  description?: string;
  details?: string;
  status: number;
  amount?: number;
  max_amount: number;
  event_date: string;
  registration_deadline?: string;
  location?: string;
  cover_image_url?: string;
  is_published?: boolean;
}) => {
  const res = await fetch(`${BASE_URL}/activity`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to create activity');
  return res.json();
};


/**
 * PUT /activities/:activityId/skills
 * เพิ่ม skills ให้ activity
 */
/**
 * PUT /activity/:activityId/skills
 * เพิ่ม skills ให้ activity
 */
export const addSkillsToActivity = async (
  activityId: string,
  skills: {
    skill_id: string;
    skill_level: number;
    note?: string;
  }[]
) => {
  const res = await fetch(`${BASE_URL}/activity/${activityId}/skill-ids`, {
    method: 'PUT',
    body: JSON.stringify(skills), // ✅ array ตรง ๆ
    headers: await getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to add skills to activity');
};




/**
 * DELETE /activities/:id
 * ลบกิจกรรม
 */
export async function deleteActivity(id: string): Promise<Activity> {
  const res = await fetch(`${BASE_URL}/activity/${id}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(), // ✅ แนบ token
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Failed to delete activity');
  }

  return res.json();
}

/**
 * GET /activities/detail/:id
 * ดึงกิจกรรมพร้อมรายชื่อ skills ที่เกี่ยวข้อง
 */
export async function getActivityDetail(id: string): Promise<ActivityWithSkills> {
  const res = await fetch(`${BASE_URL}/activity/detail/${id}`, {
    method: 'GET',
    cache: 'no-store',
    headers: await getAuthHeaders(), // ✅ แนบ token
  });

  if (!res.ok) throw new Error('ไม่พบกิจกรรมพร้อมรายละเอียด');
  return res.json();
}

/**
 * GET /activities/open
 * ดึงกิจกรรมที่เปิดรับ (status = 0) + skills
 */
export async function getOpenActivities(): Promise<ActivityWithSkills[]> {
  const res = await fetch(`${BASE_URL}/activity/open`, {
    method: 'GET',
    cache: 'no-store',
    headers: await getAuthHeaders(), // ✅ แนบ token
  });

  if (!res.ok) throw new Error('ไม่พบกิจกรรมที่เปิดรับ');
  return res.json();
}

/**
 * GET /activities/with-skills
 * ดึงกิจกรรมทั้งหมดพร้อม skills
 */
export async function getAllActivitiesWithSkills(): Promise<ActivityWithSkills[]> {
  const res = await fetch(`${BASE_URL}/activity/with-skills`, {
    method: 'GET',
    cache: 'no-store',
    headers: await getAuthHeaders(), // ✅ แนบ token
  });

  if (!res.ok) throw new Error('ไม่พบข้อมูลกิจกรรมพร้อม skills');
  return res.json();
}

/**
 * GET /activities/participants/:id
 * ดึงนักศึกษาที่เข้าร่วมกิจกรรม
 */
export async function getParticipantsByActivityId(id: string): Promise<StudentActivityWithStudentInfo[]> {
  const res = await fetch(`${BASE_URL}/activity/participants/${id}`, {
    method: 'GET',
    cache: 'no-store',
    headers: await getAuthHeaders(), // ✅ แนบ token
  });

  if (!res.ok) throw new Error('ไม่พบรายชื่อนักศึกษาในกิจกรรมนี้');
  return res.json();
}

/**
 * PUT /activities/status/:id
 * เปลี่ยนสถานะกิจกรรม
 */
/*
export async function updateActivityStatus(id: string, status: number): Promise<Activity> {
  const res = await fetch(`${BASE_URL}/activity/status/${id}`, {
    method: 'PUT',
    headers: await getAuthHeaders(), // ✅ แนบ token
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Failed to update activity status');
  }

  return res.json();
}
*/
/**
 * PUT /activities/:id/skills
 * อัปเดต skills ของกิจกรรม
 */


export async function updateActivitySkills(
  activityId: string,
  skills: { skill_id: string; skill_level: number; note?: string }[]
): Promise<void> {
  const res = await fetch(`${BASE_URL}/activity/${activityId}/skill-ids`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skills),
  });
  if (!res.ok) throw new Error('Failed to update activity skills');
}





export async function recalculateAllStudentSkills(): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/activity/recalculate-skill`, {
    method: 'POST',
    headers: await getAuthHeaders(),
  });

  if (!res.ok) throw new Error('ไม่สามารถคำนวณทักษะนักศึกษาใหม่ได้');
  return res.json();
}



export async function recalculateAllActivityAmount(): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/activity/recalculate-amount`, {
    method: 'POST',
    headers: await getAuthHeaders(),
  });

  if (!res.ok) throw new Error('ไม่สามารถคำนวณจำนวนผู้เข้าร่วมกิจกรรมใหม่ได้');
  return res.json();
}


















/** GET /activity/:id - ดึงข้อมูลกิจกรรม */
export async function getActivityById(id: string): Promise<Activity> {
  const res = await fetch(`${BASE_URL}/activity/${id}`);
  if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลกิจกรรม');
  return await res.json();
}

/** GET /activity/:id/participants - ผู้เข้าร่วม */
export async function getActivityParticipants(id: string): Promise<StudentActivityWithStudentInfo[]> {
  const res = await fetch(`${BASE_URL}/activity/${id}/participants`);
  if (!res.ok) throw new Error('ไม่สามารถดึงผู้เข้าร่วมกิจกรรม');
  return await res.json();
}

/** PUT /student-activity/:id/status - อัปเดตสถานะผู้เข้าร่วม */
export async function updateStudentActivityStatus(
  studentActivityId: string,
  status: number
): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/activity/student-activity/${studentActivityId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('ไม่สามารถอัปเดตสถานะ');
  return await res.json();
}

/** GET /activity/:id/skills - ทักษะที่ได้รับ */
export async function getActivitySkills(activityId: string): Promise<ActivitySkill[]> {
  const res = await fetch(`${BASE_URL}/activity/${activityId}/skills`);
  if (!res.ok) throw new Error('ไม่สามารถดึงทักษะของกิจกรรม');
  return await res.json();
}

/** DELETE /activity/:id/skill/:skillId - ลบทักษะออกจากกิจกรรม */
export async function deleteActivitySkill(activityId: string, skillId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/activity/${activityId}/skill/${skillId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('ไม่สามารถลบทักษะออกจากกิจกรรม');
}

/** GET /activity/:id/evaluations - การประเมินจากนักศึกษา */
export async function getActivityEvaluations(activityId: string): Promise<ActivityEvaluation[]> {
  const res = await fetch(`${BASE_URL}/activity/${activityId}/evaluations`);
  if (!res.ok) throw new Error('ไม่สามารถดึงผลการประเมินกิจกรรม');
  return await res.json();
}

/** PUT /activity/:id - แก้ไขกิจกรรม */
export async function updateActivity(
  activityId: string,
  payload: Partial<Activity>
): Promise<Activity> {
  const res = await fetch(`${BASE_URL}/activity/${activityId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Update failed:', res.status, errorText); // 👈 เพิ่มบรรทัดนี้
    throw new Error('ไม่สามารถอัปเดตกิจกรรม');
  }

  return await res.json();
}




export async function addSkillsToStudent(
  studentId: string,
  skills: { skill_id: string; skill_level: number }[]
): Promise<void> {
  const res = await fetch(`${BASE_URL}/student/addStudentSkills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: studentId, skills }),
  });
  if (!res.ok) throw new Error('เพิ่มทักษะให้นักศึกษาไม่สำเร็จ');
}




export async function submitActivityEvaluation(payload: {
  student_id: string;
  activity_id: string;
  score_venue: number;
  score_speaker: number;
  score_interest: number;
  score_content: number;
  score_applicability: number;
  score_overall: number;
  comment?: string;
  suggestions?: string;
  is_anonymous?: boolean;
}): Promise<void> {
  const res = await fetch(`${BASE_URL}/activity/evaluation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('ส่งแบบประเมินไม่สำเร็จ');
}



export async function updateConfirmationDays(activityId: string, days: number) {
  const res = await fetch(`${BASE_URL}/activity/${activityId}/confirm-days`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ days }),
  });

  if (!res.ok) {
    throw new Error('ไม่สามารถอัปเดตจำนวนวันยืนยันล่วงหน้า');
  }

  return await res.json();
}


export async function confirmStudentSkills(
  studentId: string,
  activityId: string,
  skills: { skill_id: string; level: number; note?: string }[]
) {
  const res = await fetch(`${BASE_URL}/activity/${activityId}/confirm-skills/${studentId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skills),
  });

  if (!res.ok) throw new Error('ไม่สามารถบันทึกทักษะของนักศึกษา');
  return await res.json();
}




export async function updateActivityPublish(id:string,pub:boolean){
  const res = await fetch(`${BASE_URL}/activity/${id}/publish`,{
    method:'PUT',headers:await getAuthHeaders(),
    body:JSON.stringify({is_published:pub})
  });
  if(!res.ok)throw new Error('update publish failed');
}

export async function updateActivityStatus(id:string, status:number){
  const res = await fetch(`${BASE_URL}/activity/${id}/status`,{
    method:'PUT',headers:await getAuthHeaders(),
    body:JSON.stringify({status})
  });
  if(!res.ok)throw new Error('update status failed');
}



// frontend/lib/activity.ts
export async function recalculateAmount(activityId: string): Promise<number> {
  const res = await fetch(`${BASE_URL}/activity/recalculate-amount/${activityId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to recalculate amount: ${text}`);
  }

  const data = await res.json();
  return data.amount;
}
