import { Hono } from 'hono';
import { tryCatchService } from '../lib/utils.ts';
export const studentApp = new Hono();
import { Student } from '../type/app.ts';
import { createStudent,getStudentFullDetail,
  getCompletedActivitiesWithSkills,
  addOrUpdateStudentSkills,
  getStudentActivitiesByStudent
 } from '../database/service/student.ts';


studentApp.get('/', (c) => {
  return tryCatchService(() => {
    return Promise.resolve(c.json({ message: 'GET /student' }));
  });
});



type CreateStudentInput = Omit<Student, 'id' | 'created_at' | 'updated_at'>;

studentApp.post('/', async (c) => {
  const body = await c.req.json();
  const data = body as CreateStudentInput;

  // TODO: อาจตรวจสอบ field สำคัญแบบ manual ก็ได้ (เช่น data.user_id มีไหม)
  const created = await createStudent(data);
  return c.json(created, 201);
});


studentApp.get('/:id/detail', async (c) => {
  const id = c.req.param('id');
  const data = await getStudentFullDetail(id);
  return c.json(data);
});


studentApp.get('/:id/activities/completed', async (c) => {
  const id = c.req.param('id');
  const data = await getCompletedActivitiesWithSkills(id);
  return c.json(data);
});



studentApp.post('/addStudentSkills', async (c) => {
  const body = await c.req.json();
  await addOrUpdateStudentSkills(body.student_id, body.skills);
  return c.text('success');
});


studentApp.get('/my-activities', async (c) => {
  const studentId = c.req.query('studentId');
  if (!studentId) return c.text('studentId is required', 400);

  // Validate or cast studentId to match the expected format
  if (!/^[\w-]+-[\w-]+-[\w-]+-[\w-]+-[\w-]+$/.test(studentId)) {
    return c.text('Invalid studentId format', 400);
  }

  const activities = await getStudentActivitiesByStudent(studentId as `${string}-${string}-${string}-${string}-${string}`);
  return c.json(activities);
});



