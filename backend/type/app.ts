import { UUIDTypes } from "uuid";

// User
export type UserRole = "student" | "professor" | "staff";

// Student
export type Student = {
  id?: UUIDTypes;
  user_id: UUIDTypes;
  student_code: string;     // รหัสนักศึกษา
  full_name: string;        // ชื่อเต็ม
  faculty: string;
  major: string;
  year: number;
  created_at: string;
  updated_at: string;
};

// Professor
export type Professor = {
  id?: UUIDTypes;
  user_id: UUIDTypes;
  full_name: string;         // ชื่อ-นามสกุล
  created_at: string;
  updated_at: string;
};



export type ActivityStatus = 0 | 1 | 2;

export const ActivityStatusLabel = {
  0: "open",
  1: "closed",
  2: "cancelled",
} as const;

export interface Activity {
  id?: string;
  name: string;
  description: string;
  status: ActivityStatus;
  amount: number;
  max_amount: number;
  
  event_date: string;
  created_at?: string;
  updated_at?: string;
  
}
// StudentActivity (join table)
export type StudentActivityStatus = 0 | 1 | 2 | 3;

export const StudentActivityStatusLabel = {
  0: "pending",    // รอยืนยัน
  1: "approved",   // อนุมัติแล้ว
  2: "rejected",   // ไม่อนุมัติ
  3: "completed",  // เข้าร่วมเสร็จสิ้น
} as const;


export type StudentActivity = {
  id: UUIDTypes;
  student_id: UUIDTypes;
  activity_id: UUIDTypes;
  status: StudentActivityStatus;
  participated_at: string;
};


// Skill
export type SkillType = "soft" | "hard";
export interface Skill {
  id?: UUIDTypes;
  name: string;
  skill_type: SkillType;
  created_at: string;
  updated_at: string;
};

// ActivitySkill (join table)
export type ActivitySkill = {
  id?: UUIDTypes;
  activity_id: UUIDTypes;
  skill_id: UUIDTypes;
};

// ProfessorStudent (join table)
export type ProfessorStudent = {
  id?: UUIDTypes;
  professor_id: UUIDTypes;
  student_id: UUIDTypes;
};

// StudentSkill (join table)

export type StudentSkill = {
  student_id: UUIDTypes;
  skill_id: UUIDTypes;
  skill_level: number;
  created_at: string;
};


export type ActivitySkillJoinRow = {
  id: string;
  name: string;
  description: string;
  status: number;
  amount: number;
  max_amount: number;
  event_date: string;
  created_at: string;
  updated_at: string;
  skill_name: string | null;
};



export type ActivityWithSkills = {
  id: string;
  name: string;
  description: string;
  status: number;
  amount: number;
  max_amount: number;
  event_date: string;
  created_at: string;
  updated_at: string;
  skills: string[]; // รายชื่อสกิลที่ join กับกิจกรรมนี้
};

export type StudentActivityWithStudentInfo = {
  id: string;
  student_id: string;
  activity_id: string;
  status: number;
  participated_at: string;

  full_name: string;
  student_code: string;
  faculty: string;
  major: string;
  year: number;

  activity_name: string;
  event_date: string;
};

export type StudentWithSkills = {
  id: string;
  full_name: string;
  student_code: string;
  year: number;
  skills: string[];
};
