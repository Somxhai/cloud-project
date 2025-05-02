import { Hono } from "hono";
import { assertEquals } from "jsr:@std/assert";
import { cognitoApp } from "../handler/cognito.ts"; // Assuming you have a handler for your routes
import { createUserInCognito } from "../lib/cognito.ts"; // Import your user creation function

Deno.test("POST /login returns token", async () => {
  // Step 1: Create user in Cognito (register and confirm user)
  await createUserInCognito(); // This will create 'testuser' with the password 'TestPassword123!'

  // Step 2: Set up the application route
  const app = new Hono().route("/auth", cognitoApp);

  // Step 3: Simulate login request
  const res = await app.request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username: "testuser",
      password: "TestPassword123!", // Using the same password from the signup
    }),
    headers: { "Content-Type": "application/json" },
  });

  // Step 4: Handle and assert the response
  const body = await res.json();

  console.log("✅ Route test result:", res.status, body);

  assertEquals(res.status, 200); // Expecting a 200 OK response
  if (!body.token) {
    throw new Error("Token missing in response"); // If the token is not present, it indicates failure
  }
});
