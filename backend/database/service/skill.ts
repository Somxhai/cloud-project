import { safeQuery } from '../../lib/utils.ts';
import type { Skill } from '../../type/app.ts';
import type { UUIDTypes } from '../../lib/uuid.ts';
// GET /skill
export const getAllSkills = (): Promise<Skill[]> => {
  return safeQuery((client) =>
    client.queryObject<Skill>('SELECT * FROM skill WHERE is_active = TRUE ORDER BY name_th')
      .then(res => res.rows),
    'Failed to get skills',
  );
};

// POST /skill
export const createSkill = (
  data: Omit<Skill, 'id' | 'created_at' | 'updated_at' | 'is_active'>,
): Promise<Skill> => {
  return safeQuery(async (client) => {
    const result = await client.queryObject<Skill>({
      text: `
        INSERT INTO skill (name_th, name_en, description, skill_type, icon_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `,
      args: [
        data.name_th,
        data.name_en,
        data.description ?? null,
        data.skill_type,
        data.icon_url ?? null,
      ],
    });

    return result.rows[0];
  }, 'Failed to create skill');
};

// PUT /skill/:id
export const updateSkill = (
  id: string,
  data: Partial<Omit<Skill, 'id' | 'created_at' | 'updated_at'>>,
): Promise<Skill> => {
  return safeQuery(async (client) => {
    const result = await client.queryObject<Skill>({
      text: `
        UPDATE skill SET
          name_th = COALESCE($1, name_th),
          name_en = COALESCE($2, name_en),
          description = COALESCE($3, description),
          skill_type = COALESCE($4, skill_type),
          icon_url = COALESCE($5, icon_url),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *;
      `,
      args: [
        data.name_th ?? null,
        data.name_en ?? null,
        data.description ?? null,
        data.skill_type ?? null,
        data.icon_url ?? null,
        id,
      ],
    });

    return result.rows[0];
  }, 'Failed to update skill');
};

// DELETE /skill/:id (soft delete)
export const softDeleteSkill = (id: string): Promise<void> => {
  return safeQuery(async (client) => {
    await client.queryArray(
      `UPDATE skill SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id],
    );
  }, 'Failed to delete skill');
};


export const recalculateSkillsFromLog = async (
  studentId: UUIDTypes
): Promise<void> => {
  await safeQuery(async (client) => {
    // 1. ดึง log ของ skill ทั้งหมดของ student นี้
    const logResult = await client.queryObject<{
      skill_id: string;
      level: number;
    }>(
      `SELECT skill_id, level
       FROM student_skill_log
       WHERE student_id = $1`,
      [studentId]
    );

    const skillMap = new Map<string, number>();

    for (const row of logResult.rows) {
      const prev = skillMap.get(row.skill_id) || 0;
      skillMap.set(row.skill_id, prev + row.level);
    }

    // 2. ลบ skill เดิมก่อน (หรือใช้ UPSERT ก็ได้)
    await client.queryObject(
      `DELETE FROM student_skill WHERE student_id = $1`,
      [studentId]
    );

    // 3. เพิ่ม skill ที่คำนวณใหม่เข้าไป
    for (const [skill_id, totalLevel] of skillMap.entries()) {
      await client.queryObject(
        `INSERT INTO student_skill (student_id, skill_id, level)
         VALUES ($1, $2, $3)`,
        [studentId, skill_id, totalLevel]
      );
    }
  }, "Failed to recalculate student skills");
};