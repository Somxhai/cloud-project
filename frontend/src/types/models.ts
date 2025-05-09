// ------------------ UUID ------------------
export type UUID = string;

// ------------------ User & Roles ------------------
export type UserRole = 'student' | 'professor' | 'staff';

// ------------------ Student ------------------
export interface Student {
  id?: UUID;
  user_id: UUID;
  student_code: string;
  full_name: string;
  faculty: string;
  major: string;
  year: number;
  created_at: string;
  updated_at: string;
}

// ------------------ Professor ------------------
export interface Professor {
  id?: UUID;
  user_id: UUID;
  full_name: string;
  created_at: string;
  updated_at: string;
}

// ------------------ Activity ------------------
export type ActivityType = 'academic' | 'volunteer' | 'sports' | 'art' | 'other';

export type ActivityStatus = 0 | 1 | 2;

export const ActivityStatusLabel = {
  0: 'open',
  1: 'closed',
  2: 'cancelled',
} as const;

export interface Activity {
  id?: UUID;
  name: string;
  description: string;
  status: ActivityStatus;
  amount: number;
  max_amount: number;
  event_date: string;
  created_at?: string;
  updated_at?: string;
  skills?: string[]; // Add the skills property as an optional array of strings
}

// ------------------ StudentActivity (Join) ------------------
export type StudentActivityStatus = 0 | 1 | 2 | 3;

export const StudentActivityStatusLabel = {
  0: 'pending',
  1: 'approved',
  2: 'rejected',
  3: 'completed',
} as const;

export interface StudentActivity {
  id: UUID;
  student_id: UUID;
  activity_id: UUID;
  status: StudentActivityStatus;
  participated_at: string;
}

// ------------------ Skill ------------------
export type SkillType = 'soft' | 'hard';

export interface Skill {
  id?: UUID;
  name: string;
  skill_type: SkillType;
  created_at: string;
  updated_at: string;
}

// ------------------ ActivitySkill (Join) ------------------
export interface ActivitySkill {
  id?: UUID;
  activity_id: UUID;
  skill_id: UUID;
}

// ------------------ ProfessorStudent (Join) ------------------
export interface ProfessorStudent {
  id?: UUID;
  professor_id: UUID;
  student_id: UUID;
}

// ------------------ StudentSkill (Join) ------------------
export interface StudentSkill {
  student_id: UUID;
  skill_id: UUID;
  skill_level: number; // 1–5
  created_at: string;
}


export interface ActivityWithSkills extends Omit<Activity, 'id'> {
  id: UUID;
  skills: string[]; // เช่น ['Python', 'Teamwork']
}

export interface StudentActivityWithStudentInfo extends StudentActivity {
  full_name: string;
  student_code: string;
  faculty: string;
  major: string;
  year: number;
  activity_name: string;
  event_date: string;
}

export interface StudentWithSkills {
  id: UUID;
  full_name: string;
  student_code: string;
  year: number;
  skills: string[]; // เช่น ['Leadership:3', 'Design Thinking:5']
}


export type StudentDetail = {
  id: string;
  user_id: string;
  student_code: string;
  full_name: string;
  faculty: string;
  major: string;
  year: number;
  created_at: string;
  updated_at: string;
};

export type ProfessorDetail = {
  id: string;
  user_id: string;
  full_name: string;
  created_at: string;
  updated_at: string;
};
