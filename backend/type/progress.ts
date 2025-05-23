import {
  Skill, SkillType, Student, Curriculum, Activity,
  StudentActivity
} from './app.ts';
import { UUIDTypes } from '../lib/uuid.ts';
/* ------------------ Curriculum ------------------ */
export type CurriculumSkillGap = {
  skill_id: UUIDTypes;
  name_th: string;
  name_en: string;
  skill_type: SkillType;
  units_missing: number;
  percent: number;          // 0-100
};

export type CurriculumProgress = {
  curriculum_id: UUIDTypes;
  total_students: number;
  overall_percent: number;  // 0-100
  gaps: CurriculumSkillGap[];
};

/* ------------------ Student ------------------ */
export type StudentSkillEntry = {
  skill_id: UUIDTypes;
  name_th: string;
  name_en: string;
  skill_type: SkillType;
  level_have: number;
  level_required: number;
};

export type StudentProgress = {
  student: Student;
  percent: number;          // 0-100
  units_have: number;
  units_required: number;
  completed: { hard: StudentSkillEntry[]; soft: StudentSkillEntry[] };
  partial:   { hard: StudentSkillEntry[]; soft: StudentSkillEntry[] };
  missing:   { hard: StudentSkillEntry[]; soft: StudentSkillEntry[] };
};

/* ------------------ Activity history ------------------ */
export type StudentActivitySkill = {
  skill_id: UUIDTypes;
  name_th: string;
  name_en: string;
  level: number;
};

export type StudentActivityHistory = {
  activity_id: UUIDTypes;
  name: string;
  event_date: string;
  description: string | null;
  skills: StudentActivitySkill[];
};

/* ------------------ Professor dashboard ------------------ */
export type ProfessorStudentSkillStatus = {
  skill_id: UUIDTypes;
  name_th: string;
  name_en: string;
  status: 1 | 2 | 3;  // 1 = completed, 2 = partial, 3 = missing
};

export type ProfessorStudentOverview = {
  id: UUIDTypes;
  full_name: string;
  student_code: string;
  year: number;
  curriculum_name: string;
  percent: number; // 👈 ใหม่
  skills: {
    skill_id: UUIDTypes;
    name_th: string;
    name_en: string;
    status: 1 | 2 | 3;
  }[];
};
