import { Hono } from "hono";
import { assertEquals } from "jsr:@std/assert";
import { cognitoApp } from "../handler/cognito.ts";

Deno.test("POST /login returns token", async () => {
  const app = new Hono().route("/auth", cognitoApp);

  const res = await app.request("/auth/login", {
    method: "POST",
    body: JSON.stringify({}), // or include mock credentials
    headers: { "Content-Type": "application/json" },
  });

  const body = await res.json();
  assertEquals(res.status, 200);
  console.log("✅ Route test passed:", body);
});
