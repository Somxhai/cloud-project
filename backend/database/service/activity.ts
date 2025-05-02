import { UUIDTypes } from "uuid";
import { safeQuery } from "../../lib/utils.ts";
import { Activity } from "../../type/app.ts";

// ฟังก์ชันนี้จะได้รายการกิจกรรมทั้งหมด
export const getAllActivity = async () => {
  return await safeQuery<{ rows: Activity[] }>(
    (client) =>
      client.query(
        `SELECT * FROM "activity" ORDER BY event_date;`
      ),
    "Failed to get all activities"
  ).then((res) => res.rows);
};

// ฟังก์ชันนี้จะได้รายละเอียดกิจกรรมตาม activityId
export const getActivityById = async (activityId: UUIDTypes) => {
  return await safeQuery<{ rows: Activity[] }>(
    (client) =>
      client.query(
        `SELECT * FROM "activity" WHERE id = $1`,
        [activityId.toString()]
      ),
    "Failed to get activity by ID"
  ).then((res) => res.rows[0]);
};

// ฟังก์ชันสำหรับการสร้างกิจกรรมใหม่
export const createActivity = async (activity: Activity) => {
  if (!activity.name || !activity.description || !activity.activity_type || !activity.event_date) {
    throw new Error("All fields are required to create an activity.");
  }

  const query = `
    INSERT INTO "activity" (name, description, activity_type, event_date)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  return await safeQuery<{ rows: Activity[] }>(
    (client) => client.query(query, [
      activity.name,
      activity.description,
      activity.activity_type,
      activity.event_date
    ]),
    "Failed to create activity"
  ).then((res) => res.rows);
};

// ฟังก์ชันสำหรับการอัพเดตกิจกรรม
export const updateActivity = async (activityId: UUIDTypes, updatedActivity: Partial<Activity>) => {
  const query = `
    UPDATE "activity"
    SET name = $1, description = $2, activity_type = $3, event_date = $4
    WHERE id = $5
    RETURNING *;
  `;
  return await safeQuery<{ rows: Activity[] }>(
    (client) =>
      client.query(query, [
        updatedActivity.name,
        updatedActivity.description,
        updatedActivity.activity_type,
        updatedActivity.event_date,
        activityId.toString()
      ]),
    "Failed to update activity"
  ).then((res) => res.rows);
};

// ฟังก์ชันสำหรับการลบกิจกรรม
export const deleteActivity = async (activityId: UUIDTypes) => {
  const query = `
    DELETE FROM "activity"
    WHERE id = $1
    RETURNING *;
  `;
  return await safeQuery<{ rows: Activity[] }>(
    (client) => client.query(query, [activityId.toString()]),
    "Failed to delete activity"
  ).then((res) => res.rows);
};
