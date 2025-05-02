import { Hono } from "hono";
import {
  createActivity,
  deleteActivity,
  getAllActivity,
  getActivityById,
  updateActivity,
} from "../database/service/activity.ts";
import { cognitoMiddleware } from "../middleware.ts";
import { Activity } from "../type/app.ts";

export const activityApp = new Hono<{
  Variables: { userSub: string | null };
}>();

// Public route: Get all activities
activityApp.get("/", async (c) => {
  try {
    const activities = await getAllActivity();
    return c.json(activities, 200);
  } catch (err) {
    console.error(err);
    return c.text("Internal server error", 500);
  }
});

// Public route: Get activity by id
activityApp.get("/:activityId", async (c) => {
  const activityId = c.req.param("activityId");
  if (!activityId) {
    return c.text("Missing activity ID", 400);
  }
  try {
    const activity = await getActivityById(activityId);
    if (!activity) {
      return c.text("Activity not found", 404);
    }
    return c.json(activity, 200);
  } catch (err) {
    console.error(err);
    return c.text("Internal server error", 500);
  }
});

// Apply Cognito auth to protected routes
activityApp.use(cognitoMiddleware);

// Create activity
activityApp.post("/", async (c) => {
  try {
    const activity: Activity = await c.req.json();
    const rows = await createActivity(activity);
    const created = rows[0];
    return c.json(created, 200);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("All fields are required")) {
      return c.text(err.message, 400);
    }
    console.error(err);
    return c.text("Internal server error", 500);
  }
});

// Update activity
activityApp.put("/:activityId", async (c) => {
  const activityId = c.req.param("activityId");
  if (!activityId) {
    return c.text("Missing activity ID", 400);
  }
  try {
    const activity: Activity = await c.req.json();
    const rows = await updateActivity(activityId, activity);
    const updated = rows[0];
    return c.json(updated, 200);
  } catch (err) {
    console.error(err);
    return c.text("Internal server error", 500);
  }
});

// Delete activity
activityApp.delete("/:activityId", async (c) => {
  const activityId = c.req.param("activityId");
  if (!activityId) {
    return c.text("Missing activity ID", 400);
  }
  try {
    const rows = await deleteActivity(activityId);
    const deleted = rows[0];
    return c.json(deleted, 200);
  } catch (err) {
    console.error(err);
    return c.text("Internal server error", 500);
  }
});
