import { Hono } from 'hono';
import { tryCatchService } from '../lib/utils.ts';

export const evaluationApp = new Hono();

evaluationApp.get('/', (c) => {
  return tryCatchService(() => {
    return Promise.resolve(c.json({ message: 'GET /evaluation' }));
  });
});
