import { assertEquals, assertArrayIncludes } from "jsr:@std/assert";
import { skillApp } from "../handler/skill.ts";
import { loginUserInCognito } from "./cognito_test.ts";
import { Skill } from "../type/app.ts";

// Mock services
import * as _skillService from "../database/service/skill.ts";

const mockSkills: Skill[] = [
  {
    id: "s1",
    name: "Teamwork",
    skill_type: "soft",
    created_at: "",
    updated_at: "",
  },
];

const mockAddedSkill = {
  skillId: "s1",
  studentId: "stu1",
  status: "added",
};

// Mock service functions
const _mockSkillService = {
  getAllSkill: () => mockSkills,
  createSkill: (skill: Skill) => ({ ...skill, id: "new-skill" }),
  addSkillToStudent: (_skillId: string, _studentId: string) => mockAddedSkill,
};

// Use the mockSkillService in place of skillService in your tests

Deno.test("Skill routes", async (t) => {
  const token = await loginUserInCognito();
  if (!token) throw new Error("Login failed");

  await t.step("GET / - should return all skills", async () => {
    const res = await skillApp.request("/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    assertEquals(res.status, 200);
    const skills = await res.json();
    assertArrayIncludes(skills.map((s: Skill) => s.id), [mockSkills[0].id]);
  });

  await t.step("POST /add-to-student - should add skill to student", async () => {
    const res = await skillApp.request("/add-to-student", {
      method: "POST",
      body: JSON.stringify({ skillId: "s1", studentId: "stu1" }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
    const result = await res.json();
    assertEquals(result.skillId, "s1");
    assertEquals(result.studentId, "stu1");
  });

  await t.step("POST / - should create new skill", async () => {
    const newSkill: Skill = {
      id: "",
      name: "Problem Solving",
      skill_type: "soft", // ✅ ตรงกับ schema
      created_at: "",
      updated_at: "",
    };

    const res = await skillApp.request("/", {
      method: "POST",
      body: JSON.stringify(newSkill),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    assertEquals(res.status, 200);
    const result = await res.json();
    assertEquals(result.name, "Problem Solving");
    assertEquals(result.skill_type, "soft");
  });
});
