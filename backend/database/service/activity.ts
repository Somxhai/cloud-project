import { safeQuery } from '../../lib/utils.ts';
import { Activity,
  ActivityWithSkills,
  Skill,
  StudentActivityWithStudentInfo,
  ActivitySkill,
  ActivityEvaluation,
  ActivitySkillRow,
  ActivityStatus
 } from '../../type/app.ts';
import { UUIDTypes } from "../../lib/uuid.ts";

export const getAllActivities = (): Promise<Activity[]> => {
  return safeQuery((_client) => {
    // TODO: เขียน query ดึง activity ทั้งหมด
    return Promise.resolve([]);
  }, 'Failed to get all activities');
};




type CreateActivityInput = Pick<
  Activity,
  'name' | 'description' | 'details' | 'event_date' | 'registration_deadline' |
  'location' | 'cover_image_url' | 'max_amount' | 'status' | 'amount' | 'is_published'
>;

/**
 * สร้างกิจกรรมใหม่
 */
export const createActivity = (data: CreateActivityInput): Promise<Activity> => {
  return safeQuery(async (client) => {
    const result = await client.queryObject<Activity>({
      text: `
        INSERT INTO activity (
          name, description, details, event_date, registration_deadline,
          location, cover_image_url, max_amount, status, amount, is_published
        )
        VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10, $11
        )
        RETURNING *;
      `,
      args: [
        data.name,
        data.description ?? null,
        data.details ?? null,
        data.event_date,
        data.registration_deadline ?? null,
        data.location ?? null,
        data.cover_image_url ?? null,
        data.max_amount,
        data.status,
        data.amount ?? 0,
        data.is_published ?? false,
      ],
    });

    return result.rows[0];
  }, 'Failed to create activity');
};

export const addSkillsToActivity = (
  activityId: UUIDTypes,
  skills: { skill_id: UUIDTypes; skill_level: number; note?: string }[],
): Promise<void> => {
  return safeQuery(async (client) => {
    await client.queryObject('BEGIN');

    await client.queryObject(
      'DELETE FROM activity_skill WHERE activity_id = $1',
      [activityId],
    );

    for (const skill of skills) {
      await client.queryObject(
        `
        INSERT INTO activity_skill (activity_id, skill_id, skill_level, note)
        VALUES ($1, $2, $3, $4)
        `,
        [activityId, skill.skill_id, skill.skill_level, skill.note ?? null],
      );
    }

    await client.queryObject('COMMIT');
  }, 'Failed to add skills to activity');
};





/**
 * Type ของแต่ละ row ที่ join มาจาก activity + skill
 */


/**
 * รวมกิจกรรม + ทักษะที่ join มาให้กลายเป็น ActivityWithSkills[]
 */
const groupByActivityWithSkills = (rows: ActivitySkillRow[]): ActivityWithSkills[] => {
  const map = new Map<string, ActivityWithSkills>();
  
  for (const row of rows) {
    if (row.id && !map.has(row.id)) {
      map.set(row.id ?? '', {
        id: row.id as UUIDTypes,
        name: row.name,
        description: row.activity_description ?? undefined,
        details: row.details ?? undefined,
        status: row.status as ActivityStatus,
        amount: row.amount,
        max_amount: row.max_amount,
        event_date: row.event_date,
        registration_deadline: row.registration_deadline ?? undefined,
        location: row.location ?? undefined,
        cover_image_url: row.cover_image_url ?? undefined,
        is_published: row.is_published,
        created_at: row.created_at,
        updated_at: row.updated_at,
        confirmation_days_before_event: row.confirmation_days_before_event,
        skills: [],
      });
    }

    if (row.skill_id && row.name_th && row.skill_type) {
      map.get(row.id!)?.skills.push({
        id: row.skill_id as UUIDTypes,
        name_th: row.name_th ?? '', // Assuming 'name_th' is the correct property in ActivitySkillRow
        name_en: row.name_en ?? '', // Assuming 'name_en' is the correct property in ActivitySkillRow
        description: undefined,
        skill_type: row.skill_type as Skill['skill_type'],
        is_active: true,
        icon_url: undefined,
        created_at: '',
        updated_at: '',
        skill_level: row.skill_level ?? 1,
        note: row.note ?? undefined,
      });
    }
  }

  return Array.from(map.values());
};

/**
 * ดึงกิจกรรมทั้งหมด พร้อมทักษะที่เกี่ยวข้อง
 */
export const getAllActivitiesWithSkills = async (): Promise<ActivityWithSkills[]> => {
  const rows = await safeQuery<{ rows: ActivitySkillRow[] }>(
    (client) =>
      client.queryObject(`
        SELECT 
          a.*,
          s.id AS skill_id,
          s.name_th AS skill_name,
          s.skill_type AS skill_type,
          ak.skill_level,
          ak.note
        FROM activity a
        LEFT JOIN activity_skill ak ON a.id = ak.activity_id
        LEFT JOIN skill s ON ak.skill_id = s.id
        ORDER BY a.event_date;
      `),
    'Failed to fetch all activities',
  ).then((res) => res.rows);

  return groupByActivityWithSkills(rows);
};


export const getActivityById = (id: string): Promise<Activity> => {
  return safeQuery(async (client) => {
    const result = await client.queryObject<Activity>({
      text: 'SELECT * FROM activity WHERE id = $1',
      args: [id],
    });
    return result.rows[0];
  }, 'Failed to fetch activity');
};



export const getActivityParticipants = (activityId: string): Promise<StudentActivityWithStudentInfo[]> => {
  return safeQuery(async (client) => {
    const result = await client.queryObject<StudentActivityWithStudentInfo>({
      text: `
        SELECT sa.*, s.full_name, s.student_code, s.faculty, s.major, s.year, a.name AS activity_name, a.event_date
        FROM student_activity sa
        JOIN student s ON sa.student_id = s.id
        JOIN activity a ON sa.activity_id = a.id
        WHERE sa.activity_id = $1
      `,
      args: [activityId],
    });
    return result.rows;
  }, 'Failed to fetch participants');
};



export const getActivitySkills = (id: string): Promise<ActivitySkill[]> => {
  return safeQuery(async (client) => {
    const result = await client.queryObject<ActivitySkill>({
      text: `
        SELECT s.*, ak.skill_level, ak.note
        FROM activity_skill ak
        JOIN skill s ON ak.skill_id = s.id
        WHERE ak.activity_id = $1
      `,
      args: [id],
    });
    return result.rows as ActivitySkill[];
  }, 'Failed to fetch skills for activity');
};


export const removeSkillFromActivity = (activityId: string, skillId: string): Promise<void> => {
  return safeQuery((client) =>
    client.queryArray(
      'DELETE FROM activity_skill WHERE activity_id = $1 AND skill_id = $2',
      [activityId, skillId],
    ).then(() => {}),
    'Failed to delete skill from activity'
  );
};



export const getActivityEvaluations = (id: string): Promise<ActivityEvaluation[]> => {
  return safeQuery((client) =>
    client.queryObject<ActivityEvaluation>({
      text: `
        SELECT * FROM activity_evaluation
        WHERE activity_id = $1
        ORDER BY submitted_at DESC
      `,
      args: [id],
    }).then((res) => res.rows),
    'Failed to fetch evaluations'
  );
};


export const updateParticipantStatus = (id: string, status: number): Promise<void> => {
  return safeQuery((client) =>
    client.queryArray(
      'UPDATE student_activity SET status = $1 WHERE id = $2',
      [status, id],
    ).then(() => {}),
    'Failed to update participant status'
  );
};


export const updateActivityById = (
  id: string,
  data: Partial<Activity>
): Promise<Activity> => {
  return safeQuery(async (client) => {
    const result = await client.queryObject<Activity>({
      text: `
        UPDATE activity SET
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          details = COALESCE($3, details),
          status = COALESCE($4, status),
          amount = COALESCE($5, amount),
          max_amount = COALESCE($6, max_amount),
          event_date = COALESCE($7, event_date),
          registration_deadline = COALESCE($8, registration_deadline),
          location = COALESCE($9, location),
          cover_image_url = COALESCE($10, cover_image_url),
          is_published = COALESCE($11, is_published),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $12
        RETURNING *;
      `,
      args: [
        data.name ?? null,
        data.description ?? null,
        data.details ?? null,
        data.status ?? null,
        data.amount ?? null,
        data.max_amount ?? null,
        data.event_date ?? null,
        data.registration_deadline ?? null,
        data.location ?? null,
        data.cover_image_url ?? null,
        data.is_published ?? null,
        id,
      ],
    });

    return result.rows[0];
  }, 'Failed to update activity');
};




/**
 * ดึงกิจกรรมที่เปิดรับ (status = 0) พร้อมทักษะ (รวมทักษะเป็น array)
 */
export const getOpenActivitiesWithSkills = (): Promise<ActivityWithSkills[]> => {
  const query = `
    SELECT 
      a.*,
      COALESCE(
        json_agg(
          jsonb_build_object(
            'id', s.id,
            'name_th', s.name_th,
            'name_en', s.name_en,
            'skill_type', s.skill_type,
            'icon_url', s.icon_url,
            'is_active', s.is_active,
            'skill_level', ak.skill_level,
            'note', ak.note
          )
        ) FILTER (WHERE s.id IS NOT NULL),
        '[]'
      ) AS skills
    FROM activity a
    LEFT JOIN activity_skill ak ON a.id = ak.activity_id
    LEFT JOIN skill s ON ak.skill_id = s.id
    WHERE a.status = 0
    GROUP BY a.id
    ORDER BY a.event_date ASC
  `;

  return safeQuery<{ rows: ActivityWithSkills[] }>(
    (client) => client.queryObject(query),
    'Failed to fetch open activities with full skills'
  ).then((res) => res.rows);
};




const BASE_JOIN_SELECT = `
  SELECT 
    a.id,
    a.name,
    a.description AS activity_description,
    a.details,
    a.status,
    a.amount,
    a.max_amount,
    a.event_date,
    a.registration_deadline,
    a.location,
    a.cover_image_url,
    a.is_published,
    a.created_at,
    a.updated_at,
    a.confirmation_days_before_event,

    s.id as skill_id,
    s.name_th,
    s.name_en,
    s.skill_type,
    s.description AS skill_description,
    s.icon_url,
    s.is_active,

    ak.skill_level,
    ak.note
  FROM activity a
  LEFT JOIN activity_skill ak ON a.id = ak.activity_id
  LEFT JOIN skill s ON ak.skill_id = s.id
`;






export const getActivityWithSkills = async (id: UUIDTypes): Promise<ActivityWithSkills | null> => {
  const rows = await safeQuery<{ rows: ActivitySkillRow[] }>(
    (client) => client.queryObject(`${BASE_JOIN_SELECT} WHERE a.id = $1;`, [id]),
    "Failed to fetch activity with skills",
  ).then((res) => res.rows);

  return rows.length ? groupByActivityWithSkills(rows)[0] : null;
};





export const submitActivityEvaluation = (
  data: Omit<ActivityEvaluation, 'id' | 'submitted_at'>
): Promise<void> => {
  return safeQuery(async (client) => {
    await client.queryObject(
      `
      INSERT INTO activity_evaluation (
        student_id, activity_id,
        score_venue, score_speaker, score_interest,
        score_content, score_applicability, score_overall,
        comment, suggestions, is_anonymous
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (student_id, activity_id)
      DO UPDATE SET
        score_venue = $3,
        score_speaker = $4,
        score_interest = $5,
        score_content = $6,
        score_applicability = $7,
        score_overall = $8,
        comment = $9,
        suggestions = $10,
        is_anonymous = $11,
        submitted_at = CURRENT_TIMESTAMP;
      `,
      [
        data.student_id,
        data.activity_id,
        data.score_venue,
        data.score_speaker,
        data.score_interest,
        data.score_content,
        data.score_applicability,
        data.score_overall,
        data.comment ?? null,
        data.suggestions ?? null,
        data.is_anonymous ?? false,
      ]
    );
  }, 'Failed to submit activity evaluation');
};


export const updateConfirmationDays = async (
  activityId: UUIDTypes,
  days: number
): Promise<void> => {
  await safeQuery(
    (client) =>
      client.queryArray(
        `UPDATE activity SET confirmation_days_before_event = $1 WHERE id = $2`,
        [days, activityId],
      ),
    'Failed to update confirmation_days_before_event'
  );
};


export const confirmStudentSkillsLog = async (
  studentId: UUIDTypes,
  activityId: UUIDTypes,
  skills: { skill_id: UUIDTypes; level: number; note?: string }[]
): Promise<void> => {
  await safeQuery(async (client) => {
    await client.queryObject('BEGIN');

    for (const s of skills) {
      await client.queryObject(
        `INSERT INTO student_skill_log (
          student_id, skill_id, level, obtained_from_activity, note
        ) VALUES ($1, $2, $3, $4, $5)`,
        [studentId, s.skill_id, s.level, activityId, s.note ?? null]
      );
    }

    // ✅ อัปเดต evaluation_status เป็น 1 และ status เป็น 3 (เสร็จสิ้น)
    await client.queryObject(
      `UPDATE student_activity
       SET evaluation_status = 1, status = 3
       WHERE student_id = $1 AND activity_id = $2`,
      [studentId, activityId]
    );

    await client.queryObject('COMMIT');
  }, 'Failed to confirm student skills to log');
};



// toggle publish
export const updateActivityPublish = (id: UUIDTypes, pub: boolean) =>
  safeQuery(c =>
    c.queryArray`UPDATE activity SET is_published = ${pub} WHERE id = ${id}`, 
    'Update publish failed'
  );

// change status
export const updateActivityStatus = (id: UUIDTypes, st: number) =>
  safeQuery(c =>
    c.queryArray`UPDATE activity SET status = ${st} WHERE id = ${id}`, 
    'Update status failed'
  );


export function recalculateActivityAmount(activityId: UUIDTypes): Promise<number> {
  return safeQuery(async (client) => {
    const result = await client.queryObject<{ count: number }>(
      `SELECT COUNT(*)::int AS count
       FROM student_activity
       WHERE activity_id = $1 AND status IN (1, 3)`,
      [activityId]
    );
    const amount = result.rows[0]?.count || 0;

    await client.queryObject(
      `UPDATE activity SET amount = $1 WHERE id = $2`,
      [amount, activityId]
    );

    return amount;
  }, 'Failed to recalculate activity amount');
}