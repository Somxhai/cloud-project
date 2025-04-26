// lib/db.ts
import { Client } from "pg"; // ถ้าใช้ postgres
import { PoolClient } from "npm:pg";
import {
  CREATE_STUDENT_TABLE,
  CREATE_PROFESSOR_TABLE,
  CREATE_ACTIVITY_TABLE,
  CREATE_STUDENT_ACTIVITY_TABLE,
  CREATE_SKILL_TABLE,
  CREATE_ACTIVITY_SKILL_TABLE,
  CREATE_PROFESSOR_STUDENT_TABLE,
} from "../database/sql/app.ts"; // สมมติพวก CREATE TABLE อยู่ใน database/schema.ts

// เชื่อม Database
export const client = new Client({
  user: "your_db_user",
  password: "your_db_password",
  database: "your_db_name",
  hostname: "localhost",
  port: 5432,
});

// Init database tables
export const setupDatabase = async (client: PoolClient) => {
  try {
    await client.connect();

    console.log("Connected to database ✅");

    // สร้าง table ถ้ายังไม่มี
    await client.queryArray(CREATE_STUDENT_TABLE);
    await client.queryArray(CREATE_PROFESSOR_TABLE);
    await client.queryArray(CREATE_ACTIVITY_TABLE);
    await client.queryArray(CREATE_STUDENT_ACTIVITY_TABLE);
    await client.queryArray(CREATE_SKILL_TABLE);
    await client.queryArray(CREATE_ACTIVITY_SKILL_TABLE);
    await client.queryArray(CREATE_PROFESSOR_STUDENT_TABLE);

    console.log("Database tables initialized ✅");
  } catch (err) {
    console.error("Failed to initialize database ❌", err);
  }
};
