export const CREATE_STUDENT_TABLE = `
CREATE TABLE IF NOT EXISTS "student" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  student_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  faculty TEXT NOT NULL,
  major TEXT NOT NULL,
  year INT NOT NULL,

  curriculum_id UUID REFERENCES curriculum(id),
  profile_picture_url TEXT,
  email TEXT,
  phone TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  birth_date DATE,
  line_id TEXT,
  student_status TEXT CHECK (student_status IN ('active', 'graduated', 'suspended')) DEFAULT 'active',
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;


export const CREATE_PROFESSOR_TABLE = `
CREATE TABLE IF NOT EXISTS "professor" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  department TEXT,
  faculty TEXT,
  position TEXT,
  profile_picture_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;



export const CREATE_ACTIVITY_TABLE = `
CREATE TABLE IF NOT EXISTS "activity" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,        -- คำอธิบายสั้น เช่น แนะนำกิจกรรม
  details TEXT,            -- คำอธิบายเชิงลึก เช่น วัตถุประสงค์ วิธีดำเนินงาน

  status INT NOT NULL CHECK (status IN (0, 1, 2, 3)) DEFAULT 0,
  amount INT NOT NULL DEFAULT 0,
  max_amount INT NOT NULL,

  event_date DATE NOT NULL,
  registration_deadline DATE,
  location TEXT,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  confirmation_days_before_event INT DEFAULT 3,

  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;



export const CREATE_STUDENT_ACTIVITY_TABLE = `
CREATE TABLE IF NOT EXISTS "student_activity" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  activity_id UUID NOT NULL,

  status INT NOT NULL DEFAULT 0 CHECK (status IN (0, 1, 2, 3)), -- pending, approved, rejected, completed
  confirmation_status INT DEFAULT 0 CHECK (confirmation_status IN (0, 1, 2)), -- 0=ยังไม่ตอบ, 1=ยืนยันมา, 2=ยกเลิก
  confirmed_at TIMESTAMPTZ,
  
  evaluation_status INT DEFAULT 0 CHECK (evaluation_status IN (0, 1)),
  attended BOOLEAN DEFAULT FALSE,
  feedback_submitted BOOLEAN DEFAULT FALSE,

  participated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  verified_by UUID REFERENCES professor(id),
  verified_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  CONSTRAINT student_participation_student_fk FOREIGN KEY (student_id) REFERENCES "student"(id) ON DELETE CASCADE,
  CONSTRAINT student_participation_activity_fk FOREIGN KEY (activity_id) REFERENCES "activity"(id) ON DELETE CASCADE,
  CONSTRAINT unique_student_activity UNIQUE (student_id, activity_id)
);
`;



export const CREATE_SKILL_TABLE = `
CREATE TABLE IF NOT EXISTS "skill" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  name_th TEXT NOT NULL,                 -- ชื่อทักษะภาษาไทย
  name_en TEXT NOT NULL,                 -- ชื่อทักษะภาษาอังกฤษ
  description TEXT,                      -- คำอธิบายทักษะ (เช่น ความหมายหรือเป้าหมาย)
  
  skill_type TEXT NOT NULL CHECK (skill_type IN ('soft', 'hard')), -- ประเภททักษะ

  is_active BOOLEAN DEFAULT TRUE,        -- ใช้ soft delete หรือซ่อนทักษะที่ไม่ใช้งาน
  icon_url TEXT,                         -- (optional) URL ของไอคอนแสดงทักษะ (ใช้กับ UI)

  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT unique_skill_name UNIQUE (name_th, name_en)
);
`;


export const CREATE_ACTIVITY_SKILL_TABLE = `
CREATE TABLE IF NOT EXISTS "activity_skill" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID NOT NULL,
  skill_id UUID NOT NULL,

  skill_level INT CHECK (skill_level BETWEEN 1 AND 5), -- ระดับของทักษะที่เน้นในกิจกรรม
  note TEXT,                                           -- คำอธิบายเพิ่มเติม

  CONSTRAINT activity_skill_activity_fk FOREIGN KEY (activity_id) REFERENCES "activity"(id) ON DELETE CASCADE,
  CONSTRAINT activity_skill_skill_fk FOREIGN KEY (skill_id) REFERENCES "skill"(id) ON DELETE CASCADE,
  CONSTRAINT unique_activity_skill UNIQUE (activity_id, skill_id)
);
`;




export const CREATE_STUDENT_SKILL_LOG_TABLE = `
CREATE TABLE IF NOT EXISTS "student_skill_log" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  student_id UUID NOT NULL REFERENCES student(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skill(id) ON DELETE CASCADE,
  
  level INT NOT NULL CHECK (level BETWEEN 1 AND 5),                    -- ระดับที่ได้จากกิจกรรมนี้
  obtained_from_activity UUID REFERENCES activity(id),                -- ได้จากกิจกรรมไหน
  evaluated_by UUID REFERENCES professor(id),                         -- อาจารย์ผู้ประเมิน (optional)
  note TEXT,                                                          -- หมายเหตุ/คำอธิบาย (optional)
  
  evaluated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;

export const CREATE_STUDENT_SKILL_TABLE = `
CREATE TABLE IF NOT EXISTS "student_skill" (
  student_id UUID NOT NULL REFERENCES student(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skill(id) ON DELETE CASCADE,

  level INT NOT NULL CHECK (level BETWEEN 1 AND 5),        -- ระดับล่าสุด
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (student_id, skill_id)
);
`;


export const CREATE_PROFESSOR_STUDENT_TABLE = `
CREATE TABLE IF NOT EXISTS "professor_student" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professor_id UUID NOT NULL,
  student_id UUID NOT NULL,

  CONSTRAINT professor_student_professor_fk FOREIGN KEY (professor_id) REFERENCES "professor"(id) ON DELETE CASCADE,
  CONSTRAINT professor_student_student_fk FOREIGN KEY (student_id) REFERENCES "student"(id) ON DELETE CASCADE,
  CONSTRAINT unique_professor_student UNIQUE (professor_id, student_id)
);
`;


export const CREATE_CURRICULUM_TABLE = `
CREATE TABLE IF NOT EXISTS "curriculum" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                -- ชื่อหลักสูตร เช่น "หลักสูตรวิทยาการคอมพิวเตอร์"
  description TEXT                   -- รายละเอียดหลักสูตร (optional)
);
`;

export const CREATE_CURRICULUM_SKILL_TABLE = `
CREATE TABLE IF NOT EXISTS "curriculum_skill" (
  curriculum_id UUID NOT NULL REFERENCES curriculum(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skill(id) ON DELETE CASCADE,
  required_level INT NOT NULL CHECK (required_level BETWEEN 1 AND 5), -- ระดับที่หลักสูตรต้องการ

  PRIMARY KEY (curriculum_id, skill_id)
);
`;



export const CREATE_ACTIVITY_EVALUATION_TABLE = `
CREATE TABLE IF NOT EXISTS "activity_evaluation" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  student_id UUID NOT NULL REFERENCES student(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES activity(id) ON DELETE CASCADE,

  score_venue INT CHECK (score_venue BETWEEN 1 AND 5),           -- คะแนนการจัดและสถานที่
  score_speaker INT CHECK (score_speaker BETWEEN 1 AND 5),       -- คะแนนผู้บรรยาย/ผู้จัด
  score_interest INT CHECK (score_interest BETWEEN 1 AND 5),     -- คะแนนความน่าสนใจ
  score_content INT CHECK (score_content BETWEEN 1 AND 5),       -- คะแนนเนื้อหา
  score_applicability INT CHECK (score_applicability BETWEEN 1 AND 5), -- คะแนนการเอาไปใช้ประโยชน์
  score_overall INT CHECK (score_overall BETWEEN 1 AND 5),       -- คะแนนภาพรวม

  comment TEXT,                         -- ความคิดเห็นทั่วไปจากนักศึกษา
  suggestions TEXT,                     -- ข้อเสนอแนะเพิ่มเติม
  is_anonymous BOOLEAN DEFAULT FALSE,   -- ต้องการให้ความเห็นแบบไม่เปิดเผยชื่อ

  submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (student_id, activity_id)
);
`;
