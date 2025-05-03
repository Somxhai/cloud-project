export const CREATE_STUDENT_TABLE = `
CREATE TABLE IF NOT EXISTS "student" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  faculty TEXT NOT NULL,
  major TEXT NOT NULL,
  year INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;

export const CREATE_PROFESSOR_TABLE = `
CREATE TABLE IF NOT EXISTS "professor" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;

export const CREATE_ACTIVITY_TABLE = `
CREATE TABLE IF NOT EXISTS "activity" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('academic', 'volunteer', 'sports', 'art', 'other')),
  event_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;

export const CREATE_STUDENT_ACTIVITY_TABLE = `
CREATE TABLE IF NOT EXISTS "student_activity" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  activity_id UUID NOT NULL,
  participated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT student_participation_student_fk FOREIGN KEY (student_id) REFERENCES "student"(id) ON DELETE CASCADE,
  CONSTRAINT student_participation_activity_fk FOREIGN KEY (activity_id) REFERENCES "activity"(id) ON DELETE CASCADE,
  CONSTRAINT unique_student_activity UNIQUE (student_id, activity_id)
);
`;

export const CREATE_SKILL_TABLE = `
CREATE TABLE IF NOT EXISTS "skill" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  skill_type TEXT NOT NULL CHECK (skill_type IN ('soft', 'hard')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;

export const CREATE_ACTIVITY_SKILL_TABLE = `
CREATE TABLE IF NOT EXISTS "activity_skill" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID NOT NULL,
  skill_id UUID NOT NULL,

  CONSTRAINT activity_skill_activity_fk FOREIGN KEY (activity_id) REFERENCES "activity"(id) ON DELETE CASCADE,
  CONSTRAINT activity_skill_skill_fk FOREIGN KEY (skill_id) REFERENCES "skill"(id) ON DELETE CASCADE,
  CONSTRAINT unique_activity_skill UNIQUE (activity_id, skill_id)
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

export const CREATE_STUDENT_SKILL_TABLE = `
CREATE TABLE IF NOT EXISTS "student_skill" (
  student_id UUID NOT NULL REFERENCES student(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skill(id) ON DELETE CASCADE,
  PRIMARY KEY (student_id, skill_id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;