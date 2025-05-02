import { Hono } from "hono";
import {
  addSkillToStudent,
  getAllSkill,
  createSkill,
  deleteSkill,
} from "../database/service/skill.ts";
import { cognitoMiddleware } from "../middleware.ts";
import { Skill } from "../type/app.ts";
import { tryCatchService } from "../lib/utils.ts";

export const skillApp = new Hono<{
  Variables: {
    userSub: string | null;
  };
}>();

// Public route: Get all skills
skillApp.get("/", async (c) => {
  const skills = await tryCatchService(() => getAllSkill());
  return c.json(skills);
});

// Use cognitoMiddleware to protect routes
skillApp.use(cognitoMiddleware);

// Protected route: Add skill to a student
skillApp.post("/add-to-student", async (c) => {
  const { skillId, studentId } = await c.req.json();
  const result = await tryCatchService(() => addSkillToStudent(skillId, studentId));
  if (typeof result === "object" && result !== null) {
    return c.json(result);
  }
  return c.json({ error: "Invalid result" });
});

// Protected route: Create a new skill
skillApp.post("/", async (c) => {
  const skill: Skill = await c.req.json();
  const result = await tryCatchService(() => createSkill(skill)) as Skill[] | null;
  return c.json(result?.[0] ?? { error: "Failed to create skill" });
});

// ✅ Protected route: Delete a skill by ID
skillApp.delete("/:skillId", async (c) => {
  const skillId = c.req.param("skillId");  // Extract the skillId from the route parameters
  
  if (!skillId) {
    return c.text("Missing skill ID", 400);  // Return an error if no skillId is provided
  }

  try {
    // Call your delete skill service function
    const rows = await deleteSkill(skillId);  // Assuming this deletes the skill and returns the deleted row

    if (!rows || rows.length === 0) {
      return c.text("Skill not found", 404);  // Return 404 if the skill doesn't exist
    }

    const deleted = rows[0];  // Assuming the first row is the deleted skill
    return c.json(deleted, 200);  // Return the deleted skill as a JSON response
  } catch (err) {
    console.error(err);
    return c.text("Internal server error", 500);  // Catch any errors and return 500
  }
});
