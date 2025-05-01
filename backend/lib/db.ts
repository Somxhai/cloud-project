// lib/db.ts
import "https://deno.land/x/dotenv@v3.2.2/load.ts";
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



// Init database tables
export const setupDatabase = async (client: PoolClient) => {
  try {


    console.log("Connected to database ✅");

    // สร้าง table ถ้ายังไม่มี
    await client.query(CREATE_STUDENT_TABLE);
    await client.query(CREATE_PROFESSOR_TABLE);
    await client.query(CREATE_ACTIVITY_TABLE);
    await client.query(CREATE_STUDENT_ACTIVITY_TABLE);
    await client.query(CREATE_SKILL_TABLE);
    await client.query(CREATE_ACTIVITY_SKILL_TABLE);
    await client.query(CREATE_PROFESSOR_STUDENT_TABLE);

    console.log("Database tables initialized ✅");
  } catch (err) {
    console.error("Failed to initialize database ❌", err);
  }
};
