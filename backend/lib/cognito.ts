import AWS from "aws-sdk"; // Import the CommonJS module
import crypto from "node:crypto";

const clientSecret = Deno.env.get("COGNITO_CLIENT_SECRET")!;

function getSecretHash(username: string, clientId: string, clientSecret: string): string {
  try {
    if (!clientSecret || !clientId) {
      throw new Error("Missing clientSecret or clientId.");
    }

    return crypto.createHmac("sha256", clientSecret)
      .update(username + clientId)
      .digest("base64");
  } catch (error) {
    console.error("Error generating secret hash:", error);
    throw error; // Re-throwing the error to be handled by the caller
  }
}

const { CognitoIdentityServiceProvider } = AWS; // Destructure the Cognito service
const cognito = new CognitoIdentityServiceProvider({region: "us-east-1"}); // กำหนด region ของ AWS Cognito

// ใส่ค่า environment จริงจาก AWS Cognito
const userPoolId = Deno.env.get("COGNITO_USER_POOL_ID")!;
const clientId = Deno.env.get("COGNITO_CLIENT_ID")!;

export const createUserInCognito = async () => {
  const username = "testuser";

  try {
    await cognito.adminCreateUser({
      Username: username,
      UserPoolId: userPoolId,
      TemporaryPassword: "TestPassword123!",
      UserAttributes: [
        { Name: "email", Value: "testuser@example.com" },
      ],
      MessageAction: "SUPPRESS", // ไม่ส่งเมล
    }).promise();

    // ตั้งรหัสผ่านให้เป็น permanent
    await cognito.adminSetUserPassword({
      Username: username,
      UserPoolId: userPoolId,
      Password: "TestPassword123!",
      Permanent: true,
    }).promise();

    console.log("✅ User created");
  } catch (error) {
    console.error("Error creating user:", error);
    throw error; // Re-throwing the error to be handled by the caller
  }
};

export const loginUserInCognito = async () => {
  const username = "testuser";
  const password = "TestPassword123!";

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
    if (!token) {
      throw new Error("Failed to get token from Cognito.");
    }

    console.log("✅ Login successful. ID Token:", token);
    return token;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; // Re-throwing the error to be handled by the caller
  }
};
