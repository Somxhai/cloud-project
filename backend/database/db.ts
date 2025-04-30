// db/setup.ts
import pkg from "pg"; // Import the CommonJS module
const { Pool } = pkg; // Destructure the Pool from the package

import { setupDatabase } from "../lib/db.ts";

export const pool = new Pool({
  host: Deno.env.get("PGHOST") || "localhost",
  port: parseInt(Deno.env.get("PGPORT") || "5432"),
  user: Deno.env.get("PGUSERNAME") || "postgres",
  password: Deno.env.get("PGPASSWORD") || "",
  database: Deno.env.get("PGDATABASE") || "postgres",
});

const client = await pool.connect();

await setupDatabase(client);