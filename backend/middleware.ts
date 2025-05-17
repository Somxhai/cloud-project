// backend/middleware.ts
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { Context } from "hono";
import { UserState } from "./type.ts";

const region = Deno.env.get("COGNITO_REGION"); // <== ใส่ region ของ Cognito
const userPoolId = Deno.env.get("COGNITO_USER_POOL_ID"); // <== ใส่ Cognito User Pool ID จริง
const clientId = Deno.env.get("COGNITO_CLIENT_ID");

if (!region || !userPoolId) {
  throw new Error("Cognito region or user pool ID is missing");
}

if (!clientId) {
  throw new Error("Cognito client ID is missing");
}

const verifier = CognitoJwtVerifier.create({
  userPoolId,
  tokenUse: "access",
  clientId,
});

export const cognitoMiddleware = async (
  c: Context,
  next: () => Promise<void>,
) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.text("Missing Authorization header", 401);
  }

  const token = authHeader.split(" ")[1];

  if (!token) return c.text("Invalid Authorization header", 401);

  try {
    const payload = await verifier.verify(
      token,
      {
        clientId,
        tokenUse: "access",
      },
    );

    c.set("user", {
      username: payload.username,
      sub: payload.sub,
    } as UserState);
    await next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return c.text("Unauthorized", 401);
  }
};
