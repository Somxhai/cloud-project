import { Hono } from "hono";
import {
  createUserInCognito,
  loginUserInCognito,
} from "../lib/cognito.ts";
import { cognitoMiddleware } from "../middleware.ts";
import { tryCatchService } from "../lib/utils.ts";

export const cognitoApp = new Hono<{
  Variables: {
    userSub: string;
  };
}>();

cognitoApp.post("/create-user", async (c) => {
  const result = await tryCatchService(() => createUserInCognito());
  return c.json({ message: "User created", result });
});

cognitoApp.post("/login", async (c) => {
  const token = await tryCatchService(() => loginUserInCognito());
  return c.json({ token });
});

cognitoApp.get("/me", cognitoMiddleware, async (c) => {
    await Promise.resolve(); // ป้องกัน lint error ชั่วคราว
    const userSub = c.get("userSub");
    return c.json({ message: "Authenticated", sub: userSub });
  });
  