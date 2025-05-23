import { Hono } from "hono";
import { PutObjectCommand, S3Client } from "npm:@aws-sdk/client-s3";
import { multiParser } from "https://deno.land/x/multiparser@0.114.0/mod.ts";
import { contentType } from "https://deno.land/std@0.221.0/media_types/mod.ts";
import { cognitoMiddleware } from "../middleware.ts";

type FormFile = {
  filename: string;
  type: string;
  content: Uint8Array; // multiparser ใส่ binary มาใน property นี้
};

export const uploadApp = new Hono();
uploadApp.use(cognitoMiddleware);

// ---------- S3 ----------
const s3 = new S3Client({
  region: Deno.env.get("AWS_REGION")!,
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID")!,
    secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
    sessionToken: Deno.env.get("AWS_SESSION_TOKEN")!,
  },
});

// ---------- Route ----------
uploadApp.post("/upload-image", async (c) => {
  const form = await multiParser(c.req.raw);

  // ---- ดึงไฟล์ ไม่ว่า files จะเป็น Array หรือ Object ----
  let file: FormFile | undefined;

  if (Array.isArray(form?.files) && form.files.length) {
    file = form.files[0] as FormFile;
  } else if (form?.files && typeof form.files === "object") {
    // เป็น { fieldName: FormFile }
    const firstKey = Object.keys(form.files)[0];
    file = (form.files as unknown as Record<string, FormFile>)[firstKey];
  }

  if (!file) {
    return c.json({ error: "No file uploaded" }, 400);
  }

  // ---- เตรียมข้อมูลอัปโหลด ----
  const ext = file.filename.split(".").pop();
  const key = `uploads/${crypto.randomUUID()}.${ext}`;
  const mime = contentType("." + ext) || "application/octet-stream";

  const bucket = Deno.env.get("AWS_S3_BUCKET")?.trim();
  if (!bucket) {
    throw new Error("Missing env AWS_S3_BUCKET");
  }

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file.content,
    ContentType: mime,
  });

  await s3.send(command);

  const region = Deno.env.get("AWS_REGION")!;
  const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return c.json({ url });
});
