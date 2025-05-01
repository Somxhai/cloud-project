// db/setup.ts
import pkg from "pg"; // Import the CommonJS module
const { Pool } = pkg; // Destructure the Pool from the package

import { setupDatabase } from "../lib/db.ts";
import fs from "node:fs"; // Import the fs module to read files

export const pool = new Pool({
  ssl: {
    ca: fs.readFileSync('D:/Pluem/work/CS 232/cloud-project/backend/database/us-east-1-bundle.pem').toString()
  },
  host: Deno.env.get("PGHOST") || "localhost",
  port: parseInt(Deno.env.get("PGPORT") || "5432"),
  user: Deno.env.get("PGUSERNAME") || "postgres",
  password: Deno.env.get("PGPASSWORD") || "",
  database: Deno.env.get("PGDATABASE") || "postgres",
});

const client = await pool.connect();

await setupDatabase(client);
client.release(); // Release the client back to the pool