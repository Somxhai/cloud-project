import { safeQuery } from '../../lib/utils.ts';
import { UUIDTypes } from '../../lib/uuid.ts';
/**
 * ดึงสถานะของนักศึกษาในกิจกรรม
 */
export const getStudentActivityStatus = async (
  studentId: string,
  activityId: string
): Promise<{ status: number | null; confirmation_status: number | null }> => {
  return await safeQuery(async (client) => {
    const res = await client.queryObject<{ status: number; confirmation_status: number | null }>(
      `
      SELECT status, confirmation_status,feedback_submitted
      FROM student_activity
      WHERE student_id = $1 AND activity_id = $2
      `,
      [studentId, activityId]
    );

    if (res.rows.length === 0) return { status: null, confirmation_status: null };
    return res.rows[0];
  }, 'Failed to get student activity status');
};


/**
 * ลงทะเบียนกิจกรรม (insert status = 0)
 */
export const joinActivity = async (
  studentId: string,
  activityId: string
): Promise<void> => {
  return await safeQuery(async (client) => {
    await client.queryArray(
      `INSERT INTO student_activity (student_id, activity_id, status)
       VALUES ($1, $2, 0)
       ON CONFLICT (student_id, activity_id) DO NOTHING`,
      [studentId, activityId]
    );
  }, 'Failed to join activity');
};


export const confirmAttendanceStatus = async (
  studentId: UUIDTypes,
  activityId: UUIDTypes,
  status: 1 | 2
): Promise<void> => {
  await safeQuery(
    async (client) => {
      await client.queryArray(
        `
        UPDATE student_activity
        SET confirmation_status = $1, confirmed_at = CURRENT_TIMESTAMP
        WHERE student_id = $2 AND activity_id = $3
        `,
        [status, studentId, activityId]
      );
    },
    'Failed to confirm attendance'
  );
};



export async function updateStudentAttendance(studentId: string, activityId: string, attended: boolean) {
  return await safeQuery(async (client) => {
    const result = await client.queryObject`
      UPDATE student_activity
      SET attended = ${attended}
      WHERE student_id = ${studentId} AND activity_id = ${activityId}
    `;

    if (result.rowCount === 0) {
      throw new Error('ไม่พบข้อมูล student_activity ที่ต้องการอัปเดต');
    }

    return { success: true };
  }, 'Failed to update student attendance');
}