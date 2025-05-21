import { Hono } from "hono";
import { addUserToGroup,deleteCognitoUser } from "../database/service/cognito.ts"; // ปรับเส้นทางให้ถูกต้อง
//import { cognitoMiddleware } from "../middleware.ts";
export const cognitoApp = new Hono();

cognitoApp.get("/", (c) => {
  return c.json({ message: "GET /cognito" });
});

//cognitoApp.use(cognitoMiddleware);

cognitoApp.post("/add-to-group", async (c) => {
  const { username, groupName } = await c.req.json();

  if (!username || !groupName) {
    return c.json({ error: "Missing username or groupName" }, 400);
  }

  try {
    await addUserToGroup(username, groupName);
    return c.json({ success: true });
  } catch (_err) {
    return c.json({ error: "Failed to add user to group" }, 500);
  }
});

cognitoApp.post("/delete-user", async (c) => {
  const { username } = await c.req.json();

  if (!username) {
    return c.json({ error: "Missing username" }, 400);
  }

  try {
    await deleteCognitoUser(username);
    return c.json({ success: true });
  } catch (_err) {
    return c.json({ error: "Failed to delete user" }, 500);
  }
});