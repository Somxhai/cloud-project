// ------------------ UUID ------------------
export type UUID = string;
// ------------------ User & Roles ------------------
export type UserRole = "student" | "professor" | "staff";

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
export type ActivityType =
	| "academic"
	| "volunteer"
	| "sports"
	| "art"
	| "other";

export type ActivityStatus = 0 | 1 | 2;

export const ActivityStatusLabel = {
	0: "open",
	1: "closed",
	2: "cancelled",
} as const;

export type Activity = {
	id: string;
	name: string;
	description: string;
	details?: string;
	status: number; // 0=เปิดรับ, 1=ปิดรับ, 2=ยกเลิก, 3=เสร็จสิ้น
	amount: number;
	max_amount: number;
	event_date: string; // ISO string
	registration_deadline?: string;
	location?: string;
	cover_image_url?: string;
	is_published: boolean;
	created_at: string;
	updated_at: string;
	confirmation_days_before_event: number;
};

// ------------------ StudentActivity (Join) ------------------
export type StudentActivityStatus = 0 | 1 | 2 | 3;

export const StudentActivityStatusLabel = {
	0: "pending",
	1: "approved",
	2: "rejected",
	3: "completed",
} as const;

export interface StudentActivity {
	id: UUID;
	student_id: UUID;
	activity_id: UUID;
	status: StudentActivityStatus;
	participated_at: string;
}

// ------------------ Skill ------------------
export type SkillType = "soft" | "hard";

export type Skill = {
	id: string;
	name_th: string;
	name_en: string;
	description?: string;
	skill_type: "soft" | "hard";
	icon_url?: string | null;
	is_active: boolean;
};

// ------------------ ActivitySkill (Join) ------------------
export type ActivitySkill = {
	id: string;
	activity_id: string;
	skill_id: string;

	skill_level?: number; // 1–5
	note?: string;

	name_th: string;
	name_en: string;
	skill_type: "soft" | "hard";
};

// ------------------ ProfessorStudent (Join) ------------------
export interface ProfessorStudent {
	percent: number;
	skills: string[]; // เช่น ['Leadership:3', 'Design Thinking:5']
	curriculum_name: string;
	year: number;
	full_name: string;
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
	name_th: string;
	level: string;
	updated_at: string;
}

export interface ActivityWithSkills extends Omit<Activity, "id"> {
	id: UUID;
	skills: SkillWithLevel[];
}

export type StudentActivityWithStudentInfo = {
	id: string;
	student_id: string;
	activity_id: string;
	status: number;
	confirmation_status: number;
	confirmed_at: string | null;
	evaluation_status: number;
	attended: boolean;
	feedback_submitted: boolean;
	participated_at: string;
	verified_by: string | null;
	verified_at: string | null;
	completed_at: string | null;

	// แบนราบ ไม่ใช่ nested
	full_name: string;
	student_code: string;
	faculty: string;
	major: string;
	year: number;

	activity_name: string;
	event_date: string;
};

export interface StudentWithSkills {
	id: UUID;
	full_name: string;
	student_code: string;
	percent: number;
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

export type Curriculum = {
	id: string;
	name: string;
	description: string | null;
};

export type CurriculumSkillInput = {
	skill_id: string;
	required_level: number;
};

export type CurriculumDetail = Curriculum & {
	skills: (Skill & { required_level: number })[];
	students: { id: string; full_name: string }[];
	progress_percentage: number;
	top_missing_skills: { skill_id: string; name_th: string; count: number }[];
};

export type ActivityEvaluation = {
	id: string;
	student_id: string;
	activity_id: string;

	score_venue: number;
	score_speaker: number;
	score_interest: number;
	score_content: number;
	score_applicability: number;
	score_overall: number;

	comment?: string;
	suggestions?: string;
	is_anonymous: boolean;
	submitted_at: string; // ISO 8601 (from TIMESTAMPTZ)
};

export type ActivitySkillFromApi = {
	id: string; // ← ของจริงที่ API ส่งมา
	skill_id?: string; // เผื่อ alias ในอนาคต
	skill_level: number | null;
	note: string | null;
};

export type CreateStudentInput = {
	id: string; // UUID
	user_id: string;
	student_code: string;
	full_name: string;
	faculty: string;
	major: string;
	year: number;

	curriculum_id?: string | null;
	profile_picture_url?: string | null;
	email?: string | null;
	phone?: string | null;
	gender?: "male" | "female" | "other" | null;
	birth_date?: string | null; // Format: 'YYYY-MM-DD'
	line_id?: string | null;
	student_status: "active" | "graduated" | "suspended";
	is_active: boolean;
};

export type SkillWithLevel = Skill & {
	skill_level: number;
	note?: string | null;
};

export type ActivityWithFullSkills = {
	id: string;
	name: string;
	description?: string;
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
	confirmation_days_before_event: number;
	skills: SkillWithLevel[];
};

export type StudentActivityWithActivityInfo = {
	id: string;
	student_id: string;
	activity_id: string;
	status: number;
	confirmation_status: number;
	confirmed_at: string | null;
	evaluation_status: number;
	attended: boolean;
	feedback_submitted: boolean;
	participated_at: string | null;
	verified_by: string | null;
	verified_at: string | null;
	completed_at: string | null;
	activity_name: string;
	activity_description: string; // ✅ ต้องมีบรรทัดนี้
	event_date: string;
	activity_status: number;
};

export interface CurriculumProgress {
	curriculum_id: string;
	total_students: number;
	overall_percent: number; // 0-100
	gaps: {
		skill_id: string;
		name_th: string;
		name_en: string;
		skill_type: string;
		units_missing: number;
		percent: string; // "0.00" – "100.00"
	}[];
}

/* ------------------------------------------------------------------ */
/* 1) StudentProgress – ความคืบหน้าทักษะนักศึกษา                     */
/* ------------------------------------------------------------------ */
export type StudentSkillEntry = {
	skill_id: UUID;
	name_th: string;
	name_en: string;
	skill_type: SkillType; // 'soft' | 'hard'
	level_have: number; // ระดับที่มี
	level_required: number; // ระดับที่ต้องการตามหลักสูตร
};

export type StudentProgress = {
	student: Student;
	percent: number; // ความคืบหน้าโดยรวม (0-100)
	units_have: number; // หน่วยที่มีรวม
	units_required: number; // หน่วยที่ต้องมีรวม
	completed: {
		hard: StudentSkillEntry[];
		soft: StudentSkillEntry[];
	};
	partial: {
		hard: StudentSkillEntry[];
		soft: StudentSkillEntry[];
	};
	missing: {
		hard: StudentSkillEntry[];
		soft: StudentSkillEntry[];
	};
};

/* ------------------------------------------------------------------ */
/* 2) StudentActivityHistory – กิจกรรมที่เข้าร่วม + ทักษะที่ได้       */
/* ------------------------------------------------------------------ */
export type StudentActivitySkill = {
	skill_level: number;
	skill_type: string;
	skill_id: UUID;
	name_th: string;
	name_en: string;
	level: number; // ระดับที่ได้รับจากกิจกรรม
};

export type StudentActivityHistory = {
	activity_id: UUID;
	name: string;
	event_date: string;
	description: string | null;
	cover_image_url?: string | null;
	skills: StudentActivitySkill[];
};

export type StudentSkillLog = {
	skill_id: string;
	name_th: string;
	level: number;
	activity_id: string;
	activity_name: string;
	note?: string | null;
	evaluated_at: string; // ISO format
};
