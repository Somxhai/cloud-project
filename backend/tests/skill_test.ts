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

  // await t.step("POST /add-to-student - should add skill to student", async () => {
  //   const res = await skillApp.request("/add-to-student", {
  //     method: "POST",
  //     body: JSON.stringify({ skillId: "s1", studentId: "stu1" }),
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Content-Type": "application/json",
  //     },
  //   });

  //   assertEquals(res.status, 200);
  //   const result = await res.json();
  //   assertEquals(result.skillId, "s1");
  //   assertEquals(result.studentId, "stu1");
  // });

  await t.step("DELETE /:id - delete activity", async () => {
    const res = await skillApp.request(`/${skillId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  
    assertEquals(res.status, 200);
    const deleted: Skill = await res.json();
    assertEquals(deleted.id, skillId);
  });

});
