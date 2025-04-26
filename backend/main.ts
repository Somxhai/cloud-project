// backend/main.ts
import { Hono } from 'hono';
import { cognitoMiddleware } from './middleware.ts'; // Import the middleware
import './type.ts'; // Import the extended types

const app = new Hono();

// Test route (no authentication needed)
app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// Protected route with Cognito authentication middleware
app.get('/protected', cognitoMiddleware, (c) => {
  const userSub = c.userSub;
  return c.text(`Hello, user with ID: ${userSub}`);
});

// Start the server
Deno.serve(app.fetch);
