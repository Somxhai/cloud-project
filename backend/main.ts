// backend/main.ts
import { Hono } from 'hono';
import { cognitoMiddleware } from './middleware.ts'; // Import the middleware
import './type.ts'; // Import the extended types
import {pool} from './database/db.ts'; // Import the database connection
import { activityApp } from "./handler/activity.ts";
import { professorApp } from "./handler/professor.ts";
import { studentApp } from "./handler/student.ts";
import { skillApp } from "./handler/skill.ts";
import { cognitoApp } from "./handler/cognito.ts";
import { cors } from 'hono/cors';

const app = new Hono();

// Test route (no authentication needed)
app.get('/', (c) => {
  const client = pool.connect();
  client.query('select 1');
  return c.text('Hello Hono!');
});

app.use('*', cors({
  origin: 'http://localhost:3000', // ระบุ origin ของ frontend
}));

// Protected route with Cognito authentication middleware
app.get('/protected', cognitoMiddleware, (c) => {
  const userSub = c.userSub;
  return c.text(`Hello, user with ID: ${userSub}`);
});

// Start the server
Deno.serve(app.fetch);

app.route("/activity", activityApp);
app.route("/skill", skillApp);
app.route("/professor", professorApp);
app.route("/student", studentApp);
app.route("/cognito", cognitoApp);