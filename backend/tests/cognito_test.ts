import AWS from "aws-sdk"; // Import the CommonJS module
const { CognitoIdentityServiceProvider } = AWS; // Destructure the Cognito service

const cognito = new CognitoIdentityServiceProvider();

// ใส่ค่า environment จริงจาก AWS Cognito
const userPoolId = Deno.env.get("COGNITO_USER_POOL_ID")!;
const clientId = Deno.env.get("COGNITO_CLIENT_ID")!;

export const createUserInCognito = async () => {
  const username = "testuser";

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
};

export const loginUserInCognito = async () => {
  const result = await cognito.initiateAuth({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: clientId,
    AuthParameters: {
      USERNAME: "testuser",
      PASSWORD: "TestPassword123!",
    },
  }).promise();

  const token = result.AuthenticationResult?.IdToken;
  console.log("✅ Login successful. ID Token:", token);
  return token;
};
