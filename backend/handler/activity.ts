import { Hono } from "hono";
import { tryCatchService } from "../lib/utils.ts";
import { Activity, ActivityEvaluation } from "../type/app.ts";
import { UUIDTypes } from "../lib/uuid.ts";
import {
  addSkillsToActivity,
  confirmStudentSkillsLog,
  createActivity,
  getActivityById,
  getActivityEvaluations,
  getActivityParticipants,
  getActivitySkills,
  getActivityWithSkills,
  getAllActivitiesWithSkills,
  getOpenActivitiesWithSkills,
  recalculateActivityAmount,
  removeSkillFromActivity,
  submitActivityEvaluation,
  updateActivityById,
  updateActivityPublish,
  updateActivityStatus,
  updateConfirmationDays,
  updateParticipantStatus,
} from "../database/service/activity.ts";
import { cognitoMiddleware } from "../middleware.ts";

export const activityApp = new Hono();

activityApp.get("/", (c) => {
  return tryCatchService(() => {
    return Promise.resolve(c.json({ message: "GET /activity" }));
  });
});

activityApp.get("/with-skills", async (c) => {
  try {
    const list = await getAllActivitiesWithSkills();
    return c.json(list);
  } catch (err) {
    console.error(err);
    return c.text("Internal server error", 500);
  }
});
activityApp.get("/:id/skills", async (c) => {
  const id = c.req.param("id");
  const skills = await getActivitySkills(id);
  return c.json(skills);
});

activityApp.get("/open", async (c) => {
  try {
    const activities = await getOpenActivitiesWithSkills();
    return c.json(activities);
  } catch (err) {
    console.error("Failed to get open activities:", err);
    return c.text("Internal Server Error", 500);
  }
});

activityApp.get("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await getActivityById(id);
  return c.json(data);
});

activityApp.get("/detail/:activityId", async (c) => {
  const id = c.req.param("activityId");
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return c.text("Invalid activityId format", 400);
  }
  const data = await getActivityWithSkills(
    id as `${string}-${string}-${string}-${string}-${string}`,
  );
  return c.json(data);
});

activityApp.use(cognitoMiddleware);

activityApp.post("/", async (c) => {
  const body = (await c.req.json()) as Activity;

  if (
    !body.name ||
    body.status === undefined ||
    body.max_amount === undefined ||
    !body.event_date
  ) {
    return c.text("Missing required fields", 400);
  }

  try {
    const created = await createActivity(body);
    return c.json(created, 201);
  } catch (err) {
    console.error(err);
    return c.text("Internal server error", 500);
  }
});

activityApp.put("/:activityId/skill-ids", async (c) => {
  const activityId = c.req.param("activityId");

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(activityId)) return c.text("Invalid activityId", 400);

  const body = await c.req.json();
  if (!Array.isArray(body)) {
    return c.text("Request body should be an array of skills", 400);
  }

  // Optional: validate each skill object
  for (const skill of body) {
    if (
      typeof skill.skill_id !== "string" ||
      typeof skill.skill_level !== "number"
    ) {
      return c.text("Invalid skill format", 400);
    }
  }

  try {
    await addSkillsToActivity(
      activityId as `${string}-${string}-${string}-${string}-${string}`,
      body,
    );
    return c.json({ message: "Skills successfully added to activity" });
  } catch (err) {
    console.error(err);
    return c.text("Internal server error", 500);
  }
});

activityApp.get("/:id/participants", async (c) => {
  const id = c.req.param("id");
  const list = await getActivityParticipants(id);
  return c.json(list);
});

activityApp.delete("/:id/skill/:skillId", async (c) => {
  const { id, skillId } = c.req.param();
  await removeSkillFromActivity(id, skillId);
  return c.json({ success: true });
});

activityApp.get("/:id/evaluations", async (c) => {
  const id = c.req.param("id");
  const evaluations = await getActivityEvaluations(id);
  return c.json(evaluations);
});

activityApp.put("/student-activity/:id/status", async (c) => {
  const id = c.req.param("id");
  const { status } = await c.req.json();

  if (![0, 1, 2, 3].includes(status)) {
    return c.text("Invalid status value", 400);
  }

  try {
    await updateParticipantStatus(id, status);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.text("Internal server error", 500);
  }
});

activityApp.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  try {
    const updated = await updateActivityById(id, body);
    return c.json(updated);
  } catch (err) {
    console.error(err);
    return c.text("Failed to update activity", 500);
  }
});

activityApp.post("/evaluation", async (c) => {
  const body = await c.req.json();
  const data = body as Omit<ActivityEvaluation, "id" | "submitted_at">;

  try {
    await submitActivityEvaluation(data);
    return c.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to submit evaluation:", err);
    return c.json({ error: "ไม่สามารถบันทึกแบบประเมินได้" }, 500);
  }
});

activityApp.put("/:id/confirm-days", async (c) => {
  const activityId = c.req.param("id");
  const { days } = await c.req.json();

  if (typeof days !== "number" || days < 0) {
    return c.text("Invalid confirmation day value", 400);
  }

  await updateConfirmationDays(activityId as UUIDTypes, days);
  return c.json({ success: true });
});

activityApp.post("/:activityId/confirm-skills/:studentId", async (c) => {
  const activityId = c.req.param("activityId");
  const studentId = c.req.param("studentId");
  const skills = await c.req.json();

  if (!Array.isArray(skills)) {
    return c.text("Invalid skills payload", 400);
  }

  await confirmStudentSkillsLog(
    studentId as UUIDTypes,
    activityId as UUIDTypes,
    skills,
  );
  return c.json({ success: true });
});

activityApp.put("/:id/publish", async (c) => {
  const id = c.req.param("id");
  const { is_published } = await c.req.json();
  try {
    await updateActivityPublish(
      id as `${string}-${string}-${string}-${string}-${string}`,
      is_published,
    );
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.text("Failed to update publish status", 500);
  }
});

activityApp.put("/:id/status", async (c) => {
  const id = c.req.param("id");
  const { status } = await c.req.json();
  try {
    await updateActivityStatus(
      id as `${string}-${string}-${string}-${string}-${string}`,
      status,
    );
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.text("Failed to update status", 500);
  }
});

activityApp.post("/recalculate-amount/:id", async (c) => {
  const id = c.req.param("id");
  const amount = await recalculateActivityAmount(id as UUIDTypes);
  return c.json({ amount });
});

