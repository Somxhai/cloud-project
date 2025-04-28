import { Hono } from "hono";
import {
  createActivity,
  deleteActivity,
  getAllActivity,
  getActivityById,
  updateActivity,
} from "../database/service/activity.ts";
import { cognitoMiddleware } from "../middleware.ts"; // ใช้ cognitoMiddleware แทน
import { Activity } from "../type/app.ts";
import { tryCatchService } from "../lib/utils.ts";

export const activityApp = new Hono<{
  Variables: {
    userSub: string | null;  // ตอนนี้ context จะมี userSub จาก JWT
  };
}>();

// Public route: Get all activities
activityApp.get("/", async (c) => {
  const activities = await tryCatchService(() => getAllActivity());
  return c.json(activities);
});

// Public route: Get activity by id
activityApp.get("/:activityId", async (c) => {
  const activityId = c.req.param("activityId");
  const activity = await tryCatchService(() => getActivityById(activityId));
  return c.json(activity);
});

// ใช้ Cognito Middleware ตรวจ token ก่อน
activityApp.use(cognitoMiddleware);

// Protected routes: Create/Update/Delete activity

// Create activity
activityApp.post("/", async (c) => {
  const activity: Activity = await c.req.json();
  const result = await tryCatchService(() => createActivity(activity));
  return c.json(result as Record<string, unknown>);
});

// Update activity
activityApp.put("/:activityId", async (c) => {
  const activityId = c.req.param("activityId");
  const activity: Activity = await c.req.json();
  const result = await tryCatchService(() => updateActivity(activityId, activity));
  return c.json(result as Record<string, unknown>);
});

// Delete activity
activityApp.delete("/:activityId", async (c) => {
  const activityId = c.req.param("activityId");
  const result = await tryCatchService(() => deleteActivity(activityId));
  return c.json(result as Record<string, unknown>);
});
