// db.ts
import "https://deno.land/x/dotenv@v3.2.2/load.ts"; // โหลด env

import {
  Pool,
  PoolClient,
} from "https://deno.land/x/postgres@v0.19.3/mod.ts";

import { setupDatabase } from "../lib/db.ts";

// สร้าง Pool instance
export const pool = new Pool({
  hostname: Deno.env.get("PGHOST") || "localhost",
  port: parseInt(Deno.env.get("PGPORT") || "5432"),
  user: Deno.env.get("PGUSERNAME") || "postgres",
  password: Deno.env.get("PGPASSWORD") || "",
  database: Deno.env.get("PGDATABASE") || "postgres",
  tls: {
  enabled: false,
},
// ✅ สำหรับ local, ถ้าใช้ RDS ค่อยเปิด `tls: { enabled: true }`
}, 3); // จำนวน max connections

// รัน setupDatabase
const client: PoolClient = await pool.connect();
await setupDatabase(client);
client.release();
