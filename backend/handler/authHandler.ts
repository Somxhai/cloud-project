import { Hono } from 'hono';
import { tryCatchService } from '../lib/utils.ts';

export const authApp = new Hono();

authApp.get('/me', (c) => {
  return tryCatchService(() => {
    return Promise.resolve(c.json({ message: 'GET /auth/me' }));
  });
});
