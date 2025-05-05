import { UUIDTypes } from "uuid";
import { safeQuery } from "../../lib/utils.ts";
import {
  Activity,
  ActivitySkillJoinRow,
  ActivityWithSkills,
  StudentActivityWithStudentInfo,
} from "../../type/app.ts";
// ฟังก์ชันนี้จะได้รายการกิจกรรมทั้งหมด
export const getAllActivity = async () => {
  return await safeQuery<{ rows: Activity[] }>(
    (client) =>
      client.query(
        `SELECT * FROM "activity" ORDER BY event_date;`
      ),
    "Failed to get all activities"
  ).then((res) => res.rows);
};

// ฟังก์ชันนี้จะได้รายละเอียดกิจกรรมตาม activityId
export const getActivityById = async (activityId: UUIDTypes) => {
  const query = `
    SELECT 
      a.*,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', s.id,
            'name', s.name,
            'skill_type', s.skill_type
          )
        ) FILTER (WHERE s.id IS NOT NULL),
        '[]'
      ) AS skills
    FROM "activity" a
    LEFT JOIN "activity_skill" ak ON a.id = ak.activity_id
    LEFT JOIN "skill" s ON s.id = ak.skill_id
    WHERE a.id = $1
    GROUP BY a.id
  `;

  return await safeQuery<{ rows: any[] }>(
    (client) => client.query(query, [activityId.toString()]),
    "Failed to get activity with skills"
  ).then((res) => res.rows[0]);
};


// ฟังก์ชันสำหรับการสร้างกิจกรรมใหม่
// service/activity.ts
export const createActivity = async (activity: Partial<Activity>) => {
  const query = `
    INSERT INTO activity (name, description, status, max_amount, event_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  return await safeQuery<{ rows: Activity[] }>(
    (client) => client.query(query, [
      activity.name,
      activity.description,
      activity.status,
      activity.max_amount,
      activity.event_date,
    ]),
    'Failed to create activity'
  ).then(res => res.rows[0]);
};



// ฟังก์ชันสำหรับการอัพเดตกิจกรรม
// ฟังก์ชันสำหรับการอัพเดตกิจกรรมให้ตรงกับ schema ปัจจุบัน
export const updateActivity = async (activityId: UUIDTypes, updatedActivity: Partial<Activity>) => {
  const query = `
    UPDATE "activity"
    SET 
      name = $1,
      description = $2,
      status = $3,
      amount = $4,
      max_amount = $5,
      event_date = $6,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING *;
  `;

  return await safeQuery<{ rows: Activity[] }>(
    (client) =>
      client.query(query, [
        updatedActivity.name,
        updatedActivity.description,
        updatedActivity.status,
        updatedActivity.amount,
        updatedActivity.max_amount,
        updatedActivity.event_date,
        activityId.toString(),
      ]),
    "Failed to update activity"
  ).then((res) => res.rows);
};





// ฟังก์ชันสำหรับการลบกิจกรรม
export const deleteActivity = async (activityId: UUIDTypes) => {
  const query = `
    DELETE FROM "activity"
    WHERE id = $1
    RETURNING *;
  `;
  return await safeQuery<{ rows: Activity[] }>(
    (client) => client.query(query, [activityId.toString()]),
    "Failed to delete activity"
  ).then((res) => res.rows);
};





// New

// 1. รายละเอียดกิจกรรม + skills
export const getActivityWithSkills = async (id: UUIDTypes): Promise<ActivityWithSkills | null> => {
  const query = `
    SELECT a.*, s.name as skill_name
    FROM activity a
    LEFT JOIN activity_skill ak ON a.id = ak.activity_id
    LEFT JOIN skill s ON ak.skill_id = s.id
    WHERE a.id = $1
  `;

  const rows: ActivitySkillJoinRow[] = await safeQuery<{ rows: ActivitySkillJoinRow[] }>(
    (client) => client.query(query, [id]),
    "Failed to fetch activity with skills"
  ).then(res => res.rows);

  if (rows.length === 0) return null;

  const { skill_name, ...base } = rows[0];
  const skills = rows.map(r => r.skill_name).filter((name): name is string => name !== null);
  return { ...base, skills };
};

// 2. ลิสกิจกรรมที่เปิดรับ + skills
export const getOpenActivitiesWithSkills = async (): Promise<ActivityWithSkills[]> => {
  const query = `
    SELECT a.*, s.name as skill_name
    FROM activity a
    LEFT JOIN activity_skill ak ON a.id = ak.activity_id
    LEFT JOIN skill s ON ak.skill_id = s.id
    WHERE a.status = 0
    ORDER BY a.event_date
  `;

  const rows = await safeQuery<{ rows: ActivitySkillJoinRow[] }>(
    (client) => client.query(query),
    "Failed to fetch open activities"
  ).then(res => res.rows);

  return groupByActivityWithSkills(rows);
};

// 3. ลิสกิจกรรมทั้งหมด + skills
export const getAllActivitiesWithSkills = async (): Promise<ActivityWithSkills[]> => {
  const query = `
    SELECT a.*, s.name as skill_name
    FROM activity a
    LEFT JOIN activity_skill ak ON a.id = ak.activity_id
    LEFT JOIN skill s ON ak.skill_id = s.id
    ORDER BY a.event_date
  `;

  const rows = await safeQuery<{ rows: ActivitySkillJoinRow[] }>(
    (client) => client.query(query),
    "Failed to fetch all activities"
  ).then(res => res.rows);

  return groupByActivityWithSkills(rows);
};

// 4. รายชื่อนักศึกษาที่เข้าร่วมกิจกรรม

export const getParticipantsByActivityId = async (id: UUIDTypes): Promise<StudentActivityWithStudentInfo[]> => {
  const query = `
    SELECT sa.*, st.full_name, st.student_code, st.faculty, st.major, st.year, a.name AS activity_name, a.event_date
    FROM student_activity sa
    JOIN student st ON sa.student_id = st.id
    JOIN activity a ON sa.activity_id = a.id
    WHERE sa.activity_id = $1
  `;

  return await safeQuery<{ rows: StudentActivityWithStudentInfo[] }>(
    (client) => client.query(query, [id]),
    "Failed to get participants"
  ).then(res => res.rows);
};

// 5. อัปเดตสถานะกิจกรรม
export const updateActivityStatus = async (id: UUIDTypes, status: number): Promise<Activity | null> => {
  const query = `
    UPDATE activity
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `;

  return await safeQuery<{ rows: Activity[] }>(
    (client) => client.query(query, [status, id]),
    "Failed to update activity status"
  ).then(res => res.rows[0] ?? null);
};




export const updateActivitySkills = async (activityId: UUIDTypes, skillIds: UUIDTypes[]) => {
  return await safeQuery(async (client) => {
    await client.query("BEGIN");

    // ลบ skills เดิมก่อน
    await client.query(
      `DELETE FROM activity_skill WHERE activity_id = $1`,
      [activityId]
    );

    // เพิ่ม skill ใหม่
    for (const skillId of skillIds) {
      await client.query(
        `INSERT INTO activity_skill (activity_id, skill_id) VALUES ($1, $2)`,
        [activityId, skillId]
      );
    }

    await client.query("COMMIT");
    return { success: true };
  }, "Failed to update activity skills");
};










const groupByActivityWithSkills = (rows: ActivitySkillJoinRow[]): ActivityWithSkills[] => {
  const map = new Map<string, ActivityWithSkills>();

  for (const row of rows) {
    const { skill_name, ...activityBase } = row;

    if (!map.has(row.id)) {
      map.set(row.id, {
        ...activityBase,
        skills: skill_name ? [skill_name] : [],
      });
    } else if (skill_name) {
      map.get(row.id)!.skills.push(skill_name);
    }
  }

  return Array.from(map.values());
};





export const upsertSkillsToActivity = async (
  activityId: UUIDTypes,
  skills: { name: string; skill_type: string }[]
) => {
  return await safeQuery(async (client) => {
    // 1. ลบความเชื่อมโยงเดิม
    await client.query(`DELETE FROM activity_skill WHERE activity_id = $1`, [
      activityId,
    ]);

    for (const skill of skills) {
      // 2. สร้างหรือดึง skill
      const insert = await client.query(
        `
        INSERT INTO skill (name, skill_type)
        VALUES ($1, $2)
        ON CONFLICT (name) DO UPDATE 
          SET skill_type = EXCLUDED.skill_type
        RETURNING id
        `,
        [skill.name, skill.skill_type.toLowerCase()]
      );

      const skillId = insert.rows[0].id;

      // 3. ผูกกับ activity
      await client.query(
        `INSERT INTO activity_skill (activity_id, skill_id) VALUES ($1, $2)`,
        [activityId, skillId]
      );
    }
  }, "Failed to update activity skills");
};





export const recalculateAllStudentSkills = async () => {
  return await safeQuery(async (client) => {
    // 1. ดึงข้อมูล student_id + skill_id จาก activity ที่ status = 3
    const res = await client.query(`
      SELECT 
        sa.student_id,
        ask.skill_id
      FROM student_activity sa
      JOIN activity_skill ask ON sa.activity_id = ask.activity_id
      WHERE sa.status = 3
    `);

    // ✅ แก้ตรงนี้: ระบุ type ชัดเจน
    const studentSkillMap: Map<string, Map<string, number>> = new Map();

    for (const row of res.rows) {
      const studentId: string = row.student_id;
      const skillId: string = row.skill_id;

      if (!studentSkillMap.has(studentId)) {
        studentSkillMap.set(studentId, new Map());
      }

      const skillCountMap = studentSkillMap.get(studentId)!;
      skillCountMap.set(skillId, (skillCountMap.get(skillId) || 0) + 1);
    }

    // 2. ลบข้อมูลเดิมทั้งหมด
    await client.query(`DELETE FROM student_skill`);

    // 3. เพิ่มข้อมูลใหม่
    for (const [studentId, skills] of studentSkillMap.entries()) {
      for (const [skillId, level] of skills.entries()) {
        await client.query(
          `
          INSERT INTO student_skill (student_id, skill_id, skill_level)
          VALUES ($1, $2, $3)
          `,
          [studentId, skillId, level]
        );
      }
    }
  }, "Failed to recalculate student skills");
};



// คำนวณจำนวนผู้เข้าร่วมทั้งหมดที่อนุมัติหรือเสร็จสิ้น และอัปเดต activity.amount
export const recalculateAllActivityAmount = async () => {
  return await safeQuery(async (client) => {
    // 1. สร้างตาราง mapping activity_id → amount
    const result = await client.query(`
      SELECT activity_id, COUNT(*) AS count
      FROM student_activity
      WHERE status IN (1, 3)
      GROUP BY activity_id
    `);

    const map = new Map<string, number>();
    for (const row of result.rows) {
      map.set(row.activity_id, Number(row.count));
    }

    // 2. อัปเดตค่าลง activity table
    for (const [activityId, count] of map.entries()) {
      await client.query(
        `UPDATE activity SET amount = $1 WHERE id = $2`,
        [count, activityId]
      );
    }
  }, "Failed to recalculate activity amounts");
};