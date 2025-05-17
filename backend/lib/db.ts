// lib/db.ts
import { PoolClient } from "https://deno.land/x/postgres@v0.19.3/mod.ts"; // ✅ แทน npm:pg

import {
  CREATE_ACTIVITY_EVALUATION_TABLE,
  CREATE_ACTIVITY_SKILL_TABLE,
  CREATE_ACTIVITY_TABLE,
  CREATE_CURRICULUM_SKILL_TABLE,
  CREATE_CURRICULUM_TABLE,
  CREATE_PROFESSOR_STUDENT_TABLE,
  CREATE_PROFESSOR_TABLE,
  CREATE_SKILL_TABLE,
  CREATE_STUDENT_ACTIVITY_TABLE,
  CREATE_STUDENT_SKILL_LOG_TABLE,
  CREATE_STUDENT_SKILL_TABLE,
  CREATE_STUDENT_TABLE,
} from "../database/sql/app.ts";

export const setupDatabase = async (client: PoolClient) => {
  try {
    console.log("Connected to database ✅");

    await client.queryObject(CREATE_CURRICULUM_TABLE);
    await client.queryObject(CREATE_SKILL_TABLE);
    await client.queryObject(CREATE_CURRICULUM_SKILL_TABLE);

    await client.queryObject(CREATE_STUDENT_TABLE);
    await client.queryObject(CREATE_PROFESSOR_TABLE);

    await client.queryObject(CREATE_ACTIVITY_TABLE);
    await client.queryObject(CREATE_STUDENT_ACTIVITY_TABLE);
    await client.queryObject(CREATE_ACTIVITY_SKILL_TABLE);

    await client.queryObject(CREATE_STUDENT_SKILL_TABLE);
    await client.queryObject(CREATE_STUDENT_SKILL_LOG_TABLE);

    await client.queryObject(CREATE_ACTIVITY_EVALUATION_TABLE);
    await client.queryObject(CREATE_PROFESSOR_STUDENT_TABLE);

    console.log("Database tables initialized ✅");
  } catch (err) {
    console.error("Failed to initialize database ❌", err);
  } finally {
    client.release();
  }
};
