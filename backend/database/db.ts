// db/setup.ts
import pg from "npm:pg";

const { Pool } = pg;
import { setupDatabase } from "../lib/db.ts";

export const pool = new Pool({
  host: Deno.env.get("PGHOST") || "localhost",
  port: parseInt(Deno.env.get("PGPORT") || "5439"),
  user: Deno.env.get("PGUSERNAME") || "postgres",
  password: Deno.env.get("PGPASSWORD") || "",
  database: Deno.env.get("PGDATABASE") || "postgres",
});

const client = await pool.connect();

await setupDatabase(client);