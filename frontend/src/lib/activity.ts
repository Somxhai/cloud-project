import {
  Activity,
  ActivityWithSkills,
  StudentActivityWithStudentInfo,
} from '@/types/models';

import { fetchAuthSession } from '@aws-amplify/auth';

async function getAuthHeaders() {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  if (!idToken) throw new Error('ไม่พบ token');
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
  const res = await fetch(`${BASE_URL}/activity`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch activities');
  return res.json();
}

/**
 * GET /activities/:id
 * ดึงกิจกรรมตาม ID
 */
export async function getActivityById(id: string): Promise<Activity> {
  const res = await fetch(`${BASE_URL}/activity/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('ไม่พบกิจกรรมนี้');
  return res.json();
}

/**
 * POST /activities
 * สร้างกิจกรรมใหม่
 */
export const createActivity = async (data: {
  name: string;
  description: string;
  status: number;
  max_amount: number;
  event_date: string;
}) => {
  const res = await fetch(`${BASE_URL}/activity`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to create activity');
  return res.json();
};

export const addSkillsToActivity = async (
  activityId: string,
  skills: { name: string; skill_type: string }[]
) => {
  const res = await fetch(`${BASE_URL}/activity/${activityId}/skills`, {
    method: 'PUT',
    body: JSON.stringify(skills),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to add skills to activity');
};

/**
 * PUT /activities/:id
 * อัปเดตกิจกรรม
 */
export async function updateActivity(id: string, activity: Activity): Promise<Activity> {
  const res = await fetch(`${BASE_URL}/activity/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activity),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Failed to update activity');
  }

  return res.json();
}

/**
 * DELETE /activities/:id
 * ลบกิจกรรม
 */
export async function deleteActivity(id: string): Promise<Activity> {
  const res = await fetch(`${BASE_URL}/activity/${id}`, {
    method: 'DELETE',
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
    headers: await getAuthHeaders(), // ✅ แนบ JWT Token ที่นี่
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
    headers: await getAuthHeaders(), // ✅ เพิ่มตรงนี้
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
    headers: await getAuthHeaders(), // ✅ แนบ token ที่นี่
  });

  if (!res.ok) throw new Error('ไม่พบข้อมูลกิจกรรมพร้อม skills');
  return res.json();
}

/**
 * GET /activities/participants/:id
 * ดึงนักศึกษาที่เข้าร่วมกิจกรรม
 */
export async function getParticipantsByActivityId(id: string): Promise<StudentActivityWithStudentInfo[]> {
  const res = await fetch(`${BASE_URL}/activity/participants/${id}`, { cache: 'no-store' });

  if (!res.ok) throw new Error('ไม่พบรายชื่อนักศึกษาในกิจกรรมนี้');
  return res.json();
}

/**
 * PUT /activities/status/:id
 * เปลี่ยนสถานะกิจกรรม
 */
export async function updateActivityStatus(id: string, status: number): Promise<Activity> {
  const res = await fetch(`${BASE_URL}/activity/status/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Failed to update activity status');
  }

  return res.json();
}


// ใหม่
export async function updateActivitySkills(id: string, skills: { name: string; skill_type: string }[]) {
  const res = await fetch(`${BASE_URL}/activity/${id}/skills`, {
    method: 'PUT',
    body: JSON.stringify(skills),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to update skills');
}




