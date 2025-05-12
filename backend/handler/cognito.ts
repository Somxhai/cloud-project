import { Hono } from 'hono';

export const cognitoApp = new Hono();

cognitoApp.get('/', (c) => {
  return c.json({ message: 'GET /cognito' });
});
