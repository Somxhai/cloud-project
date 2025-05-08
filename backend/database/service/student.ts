import { UUIDTypes } from "uuid";
import { safeQuery } from "../../lib/utils.ts";
import { Student } from "../../type/app.ts";
import { StudentActivity } from "../../type/app.ts";

// ฟังก์ชันนี้จะได้กิจกรรมที่นักศึกษาเข้าร่วม
export const getStudentActivities = async (studentId: UUIDTypes) => {
  return await safeQuery<{ rows: Student[] }>(
    (client) =>
      client.query(
        `SELECT * FROM "student_activity" WHERE student_id = $1 ORDER BY participated_at;`,
        [studentId]
      ),
    "Failed to get student activities"
  ).then((res) => res.rows);
};

// ฟังก์ชันนี้จะได้ทักษะของนักศึกษาจากกิจกรรมที่เคยเข้าร่วม
export const getStudentSkills = async (studentId: UUIDTypes) => {
  return await safeQuery<{ rows: Student[] }>(
    (client) =>
      client.query(
        `SELECT skill.* FROM "skill" JOIN "activity_skill" ON skill.id = activity_skill.skill_id
         JOIN "student_activity" ON student_activity.activity_id = activity_skill.activity_id
         WHERE student_activity.student_id = $1;`,
        [studentId]
      ),
    "Failed to get student skills"
  ).then((res) => res.rows);
};

// ฟังก์ชันนี้จะได้ข้อมูลทั้งหมดของนักศึกษา
export const getAllStudent = async () => {
  return await safeQuery<{ rows: Student[] }>(
    (client) =>
      client.query(
        `SELECT * FROM "student";`
      ),
    "Failed to get all students"
  ).then((res) => res.rows);
};

// ฟังก์ชันนี้จะสร้างนักศึกษาใหม่
export const createStudent = async (userId: UUIDTypes, faculty: string, major: string, year: number) => {
  const query = `
    INSERT INTO "student" (user_id, faculty, major, year)
    VALUES ($1, $2, $3, $4)
    RETURNING *;  // Returns the newly created student
  `;
  
  const values = [userId, faculty, major, year];
  
  return await safeQuery<{ rows: Student[] }>(
    (client) => client.query(query, values),
    "Failed to create student"
  ).then((res) => res.rows[0]);  // Return the newly created student (first row of result)
};









export const joinActivity = async (studentId: UUIDTypes, activityId: UUIDTypes): Promise<StudentActivity> => {
  const query = `
    INSERT INTO student_activity (student_id, activity_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [studentId, activityId];

  return await safeQuery<{ rows: StudentActivity[] }>(
    (client) => client.query(query, values),
    "Failed to join activity"
  ).then(res => res.rows[0]);
};

export const getStudentFullDetail = async (studentId: UUIDTypes) => {
  const query = `
    SELECT
      st.*,
      pr.full_name AS professor_name,
      sk.name AS skill_name,
      sk.skill_type,
      ss.skill_level
    FROM student st
    LEFT JOIN professor_student ps ON ps.student_id = st.id
    LEFT JOIN professor pr ON ps.professor_id = pr.id
    LEFT JOIN student_skill ss ON ss.student_id = st.id
    LEFT JOIN skill sk ON sk.id = ss.skill_id
    WHERE st.id = $1;
  `;

  const rows = await safeQuery<{
    rows: {
      id: string;
      user_id: string;
      full_name: string;
      student_code: string;
      faculty: string;
      major: string;
      year: number;
      created_at: string;
      updated_at: string;
      professor_name: string | null;
      skill_name: string | null;
      skill_type: "soft" | "hard" | null;
      skill_level: number | null;
    }[];
  }>(
    (client) => client.query(query, [studentId]),
    "Failed to get full student detail"
  ).then(res => res.rows);

  if (rows.length === 0) return null;

  const base = {
    id: rows[0].id,
    user_id: rows[0].user_id,
    full_name: rows[0].full_name,
    student_code: rows[0].student_code,
    faculty: rows[0].faculty,
    major: rows[0].major,
    year: rows[0].year,
    created_at: rows[0].created_at,
    updated_at: rows[0].updated_at,
    professor_name: rows[0].professor_name,
    Skill_H: [] as string[],
    Skill_S: [] as string[],
  };

  for (const row of rows) {
    if (row.skill_name && row.skill_level !== null) {
      const formatted = `${row.skill_name}:${row.skill_level}`;
      if (row.skill_type === "hard") base.Skill_H.push(formatted);
      else if (row.skill_type === "soft") base.Skill_S.push(formatted);
    }
  }

  return base;
};



type ActivityWithSkills = {
  id: string;
  name: string;
  event_date: string;
  amount: number;
  max_amount: number;
  skills: string[];
};

export const getCompletedActivitiesWithSkills = async (studentId: UUIDTypes): Promise<ActivityWithSkills[]> => {
  const query = `
    SELECT a.id, a.name, a.event_date, a.amount, a.max_amount, s.name AS skill_name
    FROM student_activity sa
    JOIN activity a ON a.id = sa.activity_id
    LEFT JOIN activity_skill ak ON ak.activity_id = a.id
    LEFT JOIN skill s ON ak.skill_id = s.id
    WHERE sa.student_id = $1 AND sa.status = 3
    ORDER BY a.event_date
  `;

  const rows = await safeQuery<{
    rows: {
      id: string;
      name: string;
      event_date: string;
      amount: number;
      max_amount: number;
      skill_name: string | null;
    }[];
  }>(
    (client) => client.query(query, [studentId]),
    "Failed to get completed activities"
  ).then(res => res.rows);

  // Group by activity
  const map = new Map<string, ActivityWithSkills>();

  for (const row of rows) {
    if (!map.has(row.id)) {
      map.set(row.id, {
        id: row.id,
        name: row.name,
        event_date: row.event_date,
        amount: row.amount,
        max_amount: row.max_amount,
        skills: row.skill_name ? [row.skill_name] : [],
      });
    } else if (row.skill_name) {
      map.get(row.id)!.skills.push(row.skill_name);
    }
  }

  return Array.from(map.values());
};



export const getStudentActivityStatus = async (studentId: UUIDTypes, activityId: UUIDTypes) => {
  const query = `
    SELECT * FROM student_activity
    WHERE student_id = $1 AND activity_id = $2
    LIMIT 1;
  `;
  return await safeQuery<{ rows: StudentActivity[] }>(
    (client) => client.query(query, [studentId, activityId]),
    "Failed to get student activity status"
  ).then(res => res.rows[0] ?? null);
};



export const updateStudentActivityStatus = async (
  activityId: UUIDTypes,
  studentId: UUIDTypes,
  status: number
) => {
  const query = `
    UPDATE student_activity
    SET status = $1
    WHERE activity_id = $2 AND student_id = $3
    RETURNING *;
  `;
  return await safeQuery<{ rows: StudentActivity[] }>(
    (client) => client.query(query, [status, activityId, studentId]),
    "Failed to update student activity status"
  ).then((res) => res.rows[0]);
};




export const createStudentByCognito = async (student: {
  id: UUIDTypes;
  user_id: UUIDTypes;
  student_code: string;
  full_name: string;
  faculty: string;
  major: string;
  year: number;
}) => {
  const query = `
    INSERT INTO student (id, user_id, student_code, full_name, faculty, major, year)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [
    student.id,
    student.user_id,
    student.student_code,
    student.full_name,
    student.faculty,
    student.major,
    student.year,
  ];

  return await safeQuery<{ rows: Student[] }>(
    (client) => client.query(query, values),
    "Failed to create student"
  ).then((res) => res.rows[0]);
};