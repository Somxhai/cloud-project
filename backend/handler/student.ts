import { Hono } from 'hono';
import { tryCatchService } from '../lib/utils.ts';
export const studentApp = new Hono();
import { Student } from '../type/app.ts';
import { createStudent,getStudentFullDetail,
  getCompletedActivitiesWithSkills,
  addOrUpdateStudentSkills,
  submitFeedback,
  getMyActivities,
  checkStudentCodeExistsService,
  getStudentByUserId,
 } from '../database/service/student.ts';
import { UUIDTypes } from '../lib/uuid.ts';

studentApp.get('/', (c) => {
  return tryCatchService(() => {
    return Promise.resolve(c.json({ message: 'GET /student' }));
  });
});



type CreateStudentInput = Omit<Student, 'created_at' | 'updated_at'>;

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

/*
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

*/

studentApp.get('/my-activities', async (c) => {
  const studentId = c.req.query('studentId');
  if (!studentId) {
    return c.json({ message: 'studentId is required' }, 400);
  }

  const rows = await getMyActivities(studentId as UUIDTypes);
  return c.json(rows);
});


studentApp.post('/:studentId/activity/:activityId/feedback', async (c) => {
  const studentId = c.req.param('studentId');
  const activityId = c.req.param('activityId');

  try {
    await submitFeedback(studentId as UUIDTypes, activityId as UUIDTypes);
    return c.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return c.json({ success: false, message }, 500);
  }
});


studentApp.get('/check-code', async (c) => {
  const student_code = c.req.query('student_code');
  if (!student_code) {
    return c.json({ error: 'Missing student_code' }, 400);
  }

  const exists = await checkStudentCodeExistsService(student_code);
  return c.json({ exists });
});


studentApp.get('/profile/:id', async (c) => {
  const id = c.req.param('id');
  if (!id) return c.text('Missing user ID', 400);

  return await tryCatchService(() => getStudentByUserId(id as UUIDTypes)).then(data => c.json(data));
});