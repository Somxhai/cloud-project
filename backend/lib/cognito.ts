import AWS from "aws-sdk";
import crypto from "node:crypto";
import { load as loadEnv } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

await loadEnv({ export: true });

const clientSecret = Deno.env.get("COGNITO_CLIENT_SECRET")!;
const clientId = Deno.env.get("COGNITO_CLIENT_ID")!;
const userPoolId = Deno.env.get("COGNITO_USER_POOL_ID")!;

if (!clientSecret || !clientId || !userPoolId) {
  throw new Error("Missing required Cognito environment variables.");
}

function getSecretHash(username: string, clientId: string, clientSecret: string): string {
  return crypto.createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: "us-east-1",
  accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID"),
  secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY"),
  sessionToken: Deno.env.get("AWS_SESSION_TOKEN"),
});

export const signUpUser = async (username: string, password: string, email: string) => {
  try {
    await cognito.signUp({
      ClientId: clientId,
      Username: username,
      Password: password,
      SecretHash: getSecretHash(username, clientId, clientSecret),
      UserAttributes: [{ Name: "email", Value: email }],
    }).promise();

    console.log("✅ User signed up successfully.");
  } catch (error: unknown) {
    if ((error as { code?: string }).code === "UsernameExistsException") {
      console.log("ℹ️ User already exists, skipping signup.");
    } else {
      console.error("❌ Error signing up user:", error);
      throw error;
    }
  }
};

export const createUserInCognito = async () => {
  const username = "testuser";
  const password = "TestPassword123!";
  const email = "testuser@example.com";

  await signUpUser(username, password, email);

  try {
    await cognito.adminConfirmSignUp({
      UserPoolId: userPoolId,
      Username: username,
    }).promise();
    console.log("✅ User confirmed successfully.");
  } catch (error: unknown) {
    if ((error as { code?: string }).code === "NotAuthorizedException") {
      console.log("ℹ️ User already confirmed.");
    } else {
      console.error("❌ Error confirming user:", error);
      throw error;
    }
  }
};

export const loginUserInCognito = async (username: string, password: string) => {
  try {
    const result = await cognito.initiateAuth({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: getSecretHash(username, clientId, clientSecret),
      },
    }).promise();

    const token = result.AuthenticationResult?.IdToken;
    if (!token) throw new Error("Failed to get token from Cognito.");

    console.log("✅ Login successful. ID Token:", token);
    return token;
  } catch (error) {
    console.error("❌ Error logging in:", error);
    throw error;
  }
};

export const confirmUserSignUp = async (username: string, confirmationCode: string) => {
  try {
    await cognito.confirmSignUp({
      ClientId: clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
      SecretHash: getSecretHash(username, clientId, clientSecret),
    }).promise();

    console.log("✅ User confirmed successfully.");
  } catch (error) {
    console.error("❌ Error confirming user:", error);
    throw error;
  }
};
