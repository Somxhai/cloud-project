import { UUIDTypes } from "uuid";

// User
export type UserRole = "student" | "professor" | "staff";

// Student
export type Student = {
  id: UUIDTypes;
  user_id: UUIDTypes;
  faculty: string;
  major: string;
  year: number;
  created_at: string;
  updated_at: string;
};

// Professor
export type Professor = {
  id: UUIDTypes;
  user_id: UUIDTypes;
  created_at: string;
  updated_at: string;
};

// Activity
export type ActivityType = "academic" | "volunteer" | "sports" | "art" | "other";

export type Activity = {
  id: UUIDTypes;
  name: string;
  description: string | null;
  activity_type: ActivityType;
  event_date: string; // format YYYY-MM-DD
  created_at: string;
  updated_at: string;
};

// StudentActivity (join table)
export type StudentActivity = {
  id: UUIDTypes;
  student_id: UUIDTypes;
  activity_id: UUIDTypes;
  participated_at: string;
};

// Skill
export type SkillType = "soft" | "hard";

export type Skill = {
  id: UUIDTypes;
  name: string;
  skill_type: SkillType;
  created_at: string;
  updated_at: string;
};

// ActivitySkill (join table)
export type ActivitySkill = {
  id: UUIDTypes;
  activity_id: UUIDTypes;
  skill_id: UUIDTypes;
};

// ProfessorStudent (join table)
export type ProfessorStudent = {
  id: UUIDTypes;
  professor_id: UUIDTypes;
  student_id: UUIDTypes;
};
