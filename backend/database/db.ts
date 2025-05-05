import pkg from "pg";
const { Pool } = pkg;

import { setupDatabase } from "../lib/db.ts";

// Read the CA file using Deno
const ca = Deno.readTextFileSync(new URL("./us-east-1-bundle.pem", import.meta.url));

export const pool = new Pool({
  host: Deno.env.get("PGHOST") || "localhost",
  port: parseInt(Deno.env.get("PGPORT") || "5432"),
  user: Deno.env.get("PGUSERNAME") || "postgres",
  password: Deno.env.get("PGPASSWORD") || "",
  database: Deno.env.get("PGDATABASE") || "postgres",
  ssl: {
    ca,                         // <- ✅ load CA cert here
    rejectUnauthorized: true,  // <- optional, can be false during dev
  },
});

const client = await pool.connect();

await setupDatabase(client);
client.release();
