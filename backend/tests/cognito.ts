// cognito.ts
import { CognitoIdentityServiceProvider } from "aws-sdk";

const cognito = new CognitoIdentityServiceProvider();

export const createUserInCognito = async () => {
  const params = {
    Username: "testuser", // ใช้ชื่อผู้ใช้ที่ต้องการ
    Password: "TestPassword123", // รหัสผ่าน
    UserPoolId: "your-user-pool-id", // ID ของ User Pool
    ClientId: "your-client-id", // Client ID
    Attributes: [
      {
        Name: "email",
        Value: "testuser@example.com",
      },
    ],
  };

  const user = await cognito.adminCreateUser(params).promise();

  return user;
};

export const loginUserInCognito = async () => {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: "your-client-id", // Client ID
    AuthParameters: {
      USERNAME: "testuser", // ชื่อผู้ใช้
      PASSWORD: "TestPassword123", // รหัสผ่าน
    },
  };

  const result = await cognito.initiateAuth(params).promise();
  return result.AuthenticationResult?.IdToken;
};
