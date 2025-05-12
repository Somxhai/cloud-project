import { UUIDTypes } from "../lib/uuid.ts";

// ==================== User Role ====================
export type UserRole = "student" | "professor" | "staff";

// ==================== Student ====================
export type Student = {
  id?: UUIDTypes;
  user_id?: UUIDTypes;
  student_code: string;
  full_name: string;
  faculty: string;
  major: string;
  year: number;
  curriculum_id?: UUIDTypes;
  profile_picture_url?: string;
  email?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  birth_date?: string;
  line_id?: string;
  student_status: "active" | "graduated" | "suspended";
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// ==================== Professor ====================
export type Professor = {
  id?: UUIDTypes;
  user_id?: UUIDTypes;
  full_name: string;
  email?: string;
  phone?: string;
  department?: string;
  faculty?: string;
  position?: string;
  profile_picture_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// ==================== Curriculum ====================
export type Curriculum = {
  id?: UUIDTypes;
  name: string;
  description?: string;
};

// ==================== Skill ====================
export type SkillType = "soft" | "hard";
export type Skill = {
  id?: UUIDTypes;
  name_th: string;
  name_en: string;
  description?: string;
  skill_type: SkillType;
  is_active: boolean;
  icon_url?: string;
  created_at: string;
  updated_at: string;
};

export type CurriculumSkill = {
  curriculum_id?: UUIDTypes;
  skill_id: UUIDTypes;
  required_level: number;
};

// ==================== Activity ====================
export type ActivityStatus = 0 | 1 | 2 | 3;
export const ActivityStatusLabel = {
  0: "open",
  1: "closed",
  2: "cancelled",
  3: "completed",
} as const;

export type Activity = {
  id?: UUIDTypes;
  name: string;
  description?: string;
  details?: string;
  status: ActivityStatus;
  amount: number;
  max_amount: number;
  event_date: string;
  registration_deadline?: string;
  location?: string;
  cover_image_url?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ActivitySkill = {
  id?: UUIDTypes;
  activity_id: UUIDTypes;
  skill_id: UUIDTypes;
  skill_level?: number;
  note?: string;
};

// ==================== StudentActivity ====================
export type StudentActivityStatus = 0 | 1 | 2 | 3;
export const StudentActivityStatusLabel = {
  0: "pending",
  1: "approved",
  2: "rejected",
  3: "completed",
} as const;

export type StudentActivity = {
  id?: UUIDTypes;
  student_id: UUIDTypes;
  activity_id: UUIDTypes;
  status: StudentActivityStatus;
  confirmation_status: 0 | 1 | 2;
  confirmed_at?: string;
  evaluation_status: 0 | 1;
  attended: boolean;
  feedback_submitted: boolean;
  participated_at: string;
  verified_by?: UUIDTypes;
  verified_at?: string;
  completed_at?: string;
};

// ==================== StudentSkill ====================
export type StudentSkill = {
  student_id: UUIDTypes;
  skill_id: UUIDTypes;
  level: number;
  updated_at: string;
};

export type StudentSkillLog = {
  id?: UUIDTypes;
  student_id: UUIDTypes;
  skill_id: UUIDTypes;
  level: number;
  obtained_from_activity?: UUIDTypes;
  evaluated_by?: UUIDTypes;
  note?: string;
  evaluated_at: string;
};

// ==================== Evaluation ====================
export type ActivityEvaluation = {
  id?: UUIDTypes;
  student_id: UUIDTypes;
  activity_id: UUIDTypes;
  score_venue?: number;
  score_speaker?: number;
  score_interest?: number;
  score_content?: number;
  score_applicability?: number;
  score_overall?: number;
  comment?: string;
  suggestions?: string;
  is_anonymous: boolean;
  submitted_at: string;
};

// ==================== Join Views ====================
export type ActivityWithSkills = Activity & {
  skills: (Skill & { skill_level?: number; note?: string })[];
};

export type StudentWithSkills = Student & {
  skills: (Skill & { level: number })[];
};

export type StudentActivityWithStudentInfo = StudentActivity & {
  full_name: string;
  student_code: string;
  faculty: string;
  major: string;
  year: number;
  activity_name: string;
  event_date: string;
};

export type CurriculumWithSkills = Curriculum & {
  skills: (Skill & { required_level: number })[];
};

export type ActivityWithStudentParticipants = Activity & {
  participants: StudentActivityWithStudentInfo[];
};

export type ProfessorStudent = {
  id: UUIDTypes;
  professor_id: UUIDTypes;
  student_id: UUIDTypes;
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



export type ActivitySkillRow = {
  id: string;
  name: string;
  activity_description?: string;
  details?: string;
  status: number;
  amount: number;
  max_amount: number;
  event_date: string;
  registration_deadline?: string;
  location?: string;
  cover_image_url?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;

  skill_id: string | null;
  name_th: string | null;
  name_en: string | null;
  skill_type: 'soft' | 'hard' | null;
  skill_description: string | null;
  icon_url: string | null;
  is_active: boolean | null;
  skill_level: number | null;
  note: string | null;
};





export type StudentActivityWithActivityInfo = StudentActivity & {
  activity_name: string;
  event_date: string;
};


export type CurriculumSkillInput = {
  skill_id: string;
  required_level: number;
};