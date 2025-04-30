// backend/middleware.ts
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { Context } from 'hono';

const region = 'ap-southeast-1'; // <== ใส่ region ของ Cognito
const userPoolId = 'ap-southeast-1_ABC123xyz'; // <== ใส่ Cognito User Pool ID จริง

const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(jwksUrl));

export const cognitoMiddleware = async (c: Context, next: () => Promise<void>) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.text('Missing Authorization header', 401);

  const token = authHeader.split(' ')[1];
  if (!token) return c.text('Invalid Authorization header', 401);

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
    });

    if (!payload || typeof payload !== 'object' || !payload.sub) {
      return c.text('Invalid token payload', 401);
    }

    c.set('userSub', payload.sub); // แนบ user ID จาก Cognito
    await next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return c.text('Unauthorized', 401);
  }
};
