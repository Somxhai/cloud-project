import { assertEquals, assertArrayIncludes } from "jsr:@std/assert";
import { skillApp } from "../handler/skill.ts";
import { loginUserInCognito } from "../lib/cognito.ts";
import { Skill } from "../type/app.ts";
import { UUIDTypes } from "uuid";

Deno.test("Skill routes", async (t) => {
  const username = "testuser";
  const password = "TestPassword123!";
  const token = await loginUserInCognito(username, password);
  if (!token) throw new Error("Login failed");

  const newSkill: Partial<Skill> = {
    name: "Test skill",
    skill_type: "soft",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  let skillId: UUIDTypes;
  let studentId: UUIDTypes;

  await t.step("POST / - should create new skill", async () => {
    const res = await skillApp.request("/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSkill),
    });

    assertEquals(res.status, 200);
    const created: Skill = await res.json();
    if (!created.id) throw new Error("No ID returned from POST /");
    skillId = created.id;
    assertEquals(created.name, newSkill.name);
  });

  await t.step("GET / - should return all skills", async () => {
    const res = await skillApp.request("/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    assertEquals(res.status, 200);
    const skills: Skill[] = await res.json();
    assertArrayIncludes(skills.map((s: Skill) => s.id), [skillId]);
  });

  await t.step("POST /add-to-student - assign skill to student", async () => {
    if (!studentId) {
      console.warn("Skipping skill-to-student test: studentId is undefined");
      return;
    }
  
    const res = await skillApp.request("/add-to-student", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ skillId, studentId }),
    });
  
    assertEquals(res.status, 200);
    const result = await res.json();
    assertEquals(result.skillId, skillId);
    assertEquals(result.studentId, studentId);
  });
  

});
