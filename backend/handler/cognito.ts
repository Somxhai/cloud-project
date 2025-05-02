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
  try {
    // รับค่า username และ password จาก body ของ request
    const { username, password } = await c.req.json();
    
    // ตรวจสอบว่าได้ข้อมูลครบหรือไม่
    if (!username || !password) {
      return c.json({ error: "Username and password are required" }, 400);
    }

    // เรียกฟังก์ชัน loginUserInCognito และส่งค่าพารามิเตอร์
    const token = await loginUserInCognito(username, password);
    
    // ส่ง token กลับไป
    return c.json({ token });
  } catch (error) {
    // จัดการข้อผิดพลาดในกรณีที่เกิด error ในฟังก์ชัน login
    console.error("Error during login:", error);
    return c.json({ error: "Login failed" }, 500);
  }
});


cognitoApp.get("/me", cognitoMiddleware, async (c) => {
    await Promise.resolve(); // ป้องกัน lint error ชั่วคราว
    const userSub = c.get("userSub");
    return c.json({ message: "Authenticated", sub: userSub });
  });
  