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

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: "us-east-1",
  accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID"),
  secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY"),
  sessionToken: Deno.env.get("AWS_SESSION_TOKEN"), // Optional
});

export async function addUserToGroup(username: string, groupName: string) {
  try {
    await cognito.adminAddUserToGroup({
      UserPoolId: userPoolId,
      Username: username,
      GroupName: groupName,
    }).promise();

    console.log(`✅ Added ${username} to group ${groupName}`);
  } catch (err) {
    console.error("❌ Failed to add user to group:", err);
    throw err;
  }
}



export async function deleteCognitoUser(username: string) {
  try {
    await cognito.adminDeleteUser({
      UserPoolId: userPoolId,
      Username: username,
    }).promise();

    console.log(`🗑️ Deleted user ${username} from Cognito`);
  } catch (err) {
    console.error("❌ Failed to delete user:", err);
    throw err;
  }
}
