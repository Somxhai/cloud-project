import { HTTPException } from "hono/http-exception";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { PoolClient } from "pg"; // coming from npm:pg
import { pool } from "../database/db.ts";

/**
 * Wraps an async function and throws a consistent HTTPException if it fails.
 */
export const tryCatchService = async <T>(
  fn: () => Promise<T>,
  status: ContentfulStatusCode = 500,
  message = "Internal Server Error",
): Promise<T> => {
  try {
    return await fn();
  } catch (err) {
    console.error("Service error:", err);
    throw new HTTPException(status, {
      message: err instanceof Error ? err.message : message,
    });
  }
};

export async function connect<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

export const safeQuery = async <T>(
  fn: (client: PoolClient) => Promise<T>,
  errorMessage: string,
): Promise<T> => {
  return await connect(fn).catch((e) => {
    console.error(errorMessage, e);
    throw new Error(errorMessage);
  });
};

export const calculateTotalPrice = (
  price_per_day: number,
  start_date: Date,
  end_date: Date,
): number => {
  const start = new Date(start_date);
  const end = new Date(end_date);
  const timeDiff = Math.abs(end.getTime() - start.getTime());
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return price_per_day * dayDiff;
};