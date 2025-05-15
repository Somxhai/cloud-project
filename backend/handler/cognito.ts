import { Hono } from 'hono';
import { addUserToGroup } from '../database/service/cognito.ts'; // ปรับเส้นทางให้ถูกต้อง
export const cognitoApp = new Hono();

cognitoApp.get('/', (c) => {
  return c.json({ message: 'GET /cognito' });
});

cognitoApp.post('/add-to-group', async (c) => {
  const { username, groupName } = await c.req.json();

  if (!username || !groupName) {
    return c.json({ error: 'Missing username or groupName' }, 400);
  }

  try {
    await addUserToGroup(username, groupName);
    return c.json({ success: true });
  } catch (_err) {
    return c.json({ error: 'Failed to add user to group' }, 500);
  }
});