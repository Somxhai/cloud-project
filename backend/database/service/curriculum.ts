import { safeQuery } from '../../lib/utils.ts';
import { Curriculum,CurriculumWithSkills,CurriculumSkillInput } from '../../type/app.ts';
import { UUIDTypes } from '../../lib/uuid.ts';

export const getAllCurriculums = (): Promise<Curriculum[]> => {
  return safeQuery((client) =>
    client.queryObject<Curriculum>('SELECT * FROM curriculum ORDER BY name')
      .then(res => res.rows),
    'Failed to fetch all curriculums',
  );
};


// GET /curriculum/:id
export const getCurriculumDetail = (id: string): Promise<CurriculumWithSkills> => {
  return safeQuery(async (client) => {
    const curriculumRes = await client.queryObject<Curriculum>({
      text: `SELECT * FROM curriculum WHERE id = $1`,
      args: [id],
    });

    const skillRes = await client.queryObject({
      text: `
        SELECT s.*, cs.required_level
        FROM curriculum_skill cs
        JOIN skill s ON cs.skill_id = s.id
        WHERE cs.curriculum_id = $1
      `,
      args: [id],
    });

    return {
      ...curriculumRes.rows[0],
      skills: skillRes.rows as CurriculumWithSkills['skills'],
    };
  }, 'Failed to fetch curriculum detail');
};

// PUT /curriculum/:id/skills
export const updateCurriculumSkills = (
  curriculumId: string,
  skills: { skill_id: string; required_level: number }[],
): Promise<number> => {
  return safeQuery(async (client) => {
    await client.queryArray('DELETE FROM curriculum_skill WHERE curriculum_id = $1', [curriculumId]);

    for (const skill of skills) {
      await client.queryArray(
        `INSERT INTO curriculum_skill (curriculum_id, skill_id, required_level)
         VALUES ($1, $2, $3)`,
        [curriculumId, skill.skill_id, skill.required_level],
      );
    }

    return skills.length;
  }, 'Failed to update curriculum skills');
};

// DELETE /curriculum/:id
export const deleteCurriculum = (id: string): Promise<void> => {
  return safeQuery((client) =>
    client.queryArray('DELETE FROM curriculum WHERE id = $1', [id]).then(() => {}),
    'Failed to delete curriculum',
  );
};

// POST /curriculum
type CreateCurriculumInput = Omit<Curriculum, 'id'>;
export const createCurriculum = (data: CreateCurriculumInput): Promise<Curriculum> => {
  return safeQuery(async (client) => {
    const result = await client.queryObject<Curriculum>({
      text: `INSERT INTO curriculum (name, description) VALUES ($1, $2) RETURNING *`,
      args: [data.name, data.description ?? null],
    });

    return result.rows[0];
  }, 'Failed to create curriculum');
};


export const getCurriculumSkills = async (
  curriculumId: UUIDTypes
): Promise<CurriculumSkillInput[]> => {
  const result = await safeQuery<{ rows: CurriculumSkillInput[] }>(
    (client) =>
      client.queryObject(
        `SELECT skill_id, required_level FROM curriculum_skill WHERE curriculum_id = $1`,
        [curriculumId]
      ),
    'Failed to fetch curriculum skills'
  );

  return result.rows;
};