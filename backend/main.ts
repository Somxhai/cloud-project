// backend/main.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { cognitoMiddleware } from './middleware.ts';
import './type.ts'; // โหลด extended types
import { safeQuery } from './lib/utils.ts';

// Import route apps จาก handler ทั้งหมด
import { activityApp } from './handler/activity.ts';
import { professorApp } from './handler/professor.ts';
import { studentApp } from './handler/student.ts';
import { skillApp } from './handler/skill.ts';
import { curriculumApp } from './handler/curriculum.ts';
import { evaluationApp } from './handler/evaluation.ts';
import { cognitoApp } from './handler/cognito.ts';
import { authApp } from './handler/authHandler.ts';
import { studentActivityApp } from './handler/student_activity.ts';

const app = new Hono();

// Middleware: CORS สำหรับ frontend
app.use('*', cors({
  origin: 'http://localhost:3000', // ปรับ origin ให้ตรงกับ frontend
}));

// Test route
app.get('/', async (c) => {
  await safeQuery(
    (client) => client.queryObject('SELECT 1'),
    'DB connection failed',
  );
  return c.text('Hello Hono!');
});

// Protected route (Cognito auth)
app.get('/protected', cognitoMiddleware, (c) => {
  return c.text(`Hello, user with ID: ${c.userSub}`);
});

// Mount route apps
app.route('/activity', activityApp);
app.route('/skill', skillApp);
app.route('/professor', professorApp);
app.route('/student', studentApp);
app.route('/curriculum', curriculumApp);
app.route('/evaluation', evaluationApp);
app.route('/cognito', cognitoApp);
app.route('/auth', authApp);

app.route('/student-activity', studentActivityApp);
// Start server
Deno.serve(app.fetch);
