import { Hono } from 'hono';
import { getAllCurriculums, getCurriculumDetail, updateCurriculumSkills, deleteCurriculum, createCurriculum,getCurriculumSkills } from '../database/service/curriculum.ts';
import type { Curriculum } from '../type/app.ts';

export const curriculumApp = new Hono();

type CreateCurriculumInput = Omit<Curriculum, 'id'>;

// GET /curriculum
curriculumApp.get('/', async (c) => {
  const list = await getAllCurriculums();
  return c.json(list);
});

// GET /curriculum/:id
curriculumApp.get('/:id', async (c) => {
  const id = c.req.param('id');
  const detail = await getCurriculumDetail(id);
  return c.json(detail);
});

// PUT /curriculum/:id/skills
curriculumApp.put('/:id/skills', async (c) => {
  const id = c.req.param('id');
  const skills = await c.req.json(); // expected: { skill_id: string; required_level: number }[]
  const updated = await updateCurriculumSkills(id, skills);
  return c.json({ updated });
});

// DELETE /curriculum/:id
curriculumApp.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await deleteCurriculum(id);
  return c.json({ success: true });
});

// POST /curriculum
curriculumApp.post('/', async (c) => {
  const body = await c.req.json();
  const data = body as CreateCurriculumInput;
  const created = await createCurriculum(data);
  return c.json(created, 201);
});


curriculumApp.get('/:id/skills', async (c) => {
  const id = c.req.param('id');
  if (!/^\w+-\w+-\w+-\w+-\w+$/.test(id)) {
    return c.json({ error: 'Invalid ID format' }, 400);
  }
  const data = await getCurriculumSkills(id as `${string}-${string}-${string}-${string}-${string}`);
  return c.json(data);
});