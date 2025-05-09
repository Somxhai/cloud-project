import { Hono } from "hono";
import {
  createActivity,
  deleteActivity,
  getAllActivity,
  getActivityById,
  updateActivity,
  // เพิ่มฟังก์ชันใหม่
  getActivityWithSkills,
  getOpenActivitiesWithSkills,
  getAllActivitiesWithSkills,
  getParticipantsByActivityId,
  updateActivityStatus,
  upsertSkillsToActivity,
  recalculateAllStudentSkills,
  recalculateAllActivityAmount
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



// Apply Cognito auth to protected routes
activityApp.use(cognitoMiddleware);

// Create activity
activityApp.post("/", async (c) => {
  try {
    const activity: Activity = await c.req.json();

    // ตรวจสอบข้อมูลที่จำเป็น
    if (
      !activity.name ||
      !activity.description ||
      activity.status === undefined ||
      activity.max_amount === undefined ||
      !activity.event_date
    ) {
      return c.text("All fields are required", 400);
    }

    const created: Activity = await createActivity(activity);
    return c.json(created, 201);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("All fields are required")) {
      return c.text(err.message, 400);
    }

    console.error("Failed to create activity:", err);
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





// New
// 1. Get full activity detail with skills
activityApp.get("/detail/:activityId", async (c) => {
  const id = c.req.param("activityId");
  const result = await getActivityWithSkills(id);
  return c.json(result);
});

// 2. Get open activities with skills
activityApp.get("/open", async (c) => {
  const result = await getOpenActivitiesWithSkills();
  return c.json(result);
});

// 3. Get all activities with skills
activityApp.get("/with-skills", async (c) => {
  const result = await getAllActivitiesWithSkills();
  return c.json(result);
});

// 4. Get participants of an activity
activityApp.get("/participants/:activityId", async (c) => {
  const id = c.req.param("activityId");
  const result = await getParticipantsByActivityId(id);
  return c.json(result);
});

// 5. Update activity status
activityApp.put("/status/:activityId", async (c) => {
  const id = c.req.param("activityId");
  const { status } = await c.req.json();
  const result = await updateActivityStatus(id, status);
  return c.json(result);
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



// 🔽 เพิ่มท้ายไฟล์ หรือใต้ PUT /status/:activityId ก็ได้
activityApp.put("/:activityId/skills", async (c) => {
  const activityId = c.req.param("activityId");

  const skills: { name: string; skill_type: string }[] = await c.req.json();

  if (!Array.isArray(skills)) {
    return c.text("Invalid skill list", 400);
  }

  try {
    await upsertSkillsToActivity(activityId, skills);
    return c.json({ message: "Skills updated successfully" });
  } catch (err) {
    console.error(err);
    return c.text("Internal server error", 500);
  }
});

activityApp.post("/recalculate-skill", async (c) => {
  try {
    await recalculateAllStudentSkills();
    return c.json({ message: "Recalculated student skills successfully" });
  } catch (err) {
    console.error(err);
    return c.text("Failed to recalculate skills", 500);
  }
});


activityApp.post("/recalculate-amount", async (c) => {
  try {
    await recalculateAllActivityAmount();
    return c.json({ message: "Recalculated activity amounts successfully" });
  } catch (err) {
    console.error(err);
    return c.text("Failed to recalculate activity amounts", 500);
  }
});


