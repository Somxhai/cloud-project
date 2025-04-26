// backend/lib/authMiddleware.ts
import { jwtVerify } from 'jose';  // Correct import for JWT verification
import { Context } from 'hono';  // Import only the Context type from hono

// Define the middleware function with types for context (c) and next
export const cognitoMiddleware = async (c: Context, next: () => Promise<void>) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.text('Missing Authorization header', 401);
  }

  const token = authHeader.split(' ')[1]; // 'Bearer <token>'
  if (!token) {
    return c.text('Invalid Authorization header', 401);
  }

  try {
    // You need to get the public key from AWS Cognito's JWKS (JSON Web Key Set)
    // Here's an example of how you can get the key. This is just a placeholder for how you would fetch and verify using the key:
    const secretKey = await fetchCognitoPublicKey();  // Fetch the public key from Cognito's JWKS endpoint

    // Verify the JWT with the public key
    const { payload } = await jwtVerify(token, secretKey);

    if (!payload || typeof payload !== 'object' || !payload.sub) {
      return c.text('Invalid token payload', 401);
    }

    // Attach the userSub (Cognito user ID) to the request context
    c.set('userSub', payload.sub);

    // Proceed with the next middleware or route handler
    await next();
  } catch (err) {
    console.error('Token verification failed', err);
    return c.text('Unauthorized', 401);
  }
};

// Fetch the Cognito public key to verify the JWT token (this is an example, implement according to your setup)
async function fetchCognitoPublicKey() {
  const jwksUrl = 'https://cognito-idp.<region>.amazonaws.com/<userPoolId>/.well-known/jwks.json';
  const response = await fetch(jwksUrl);
  const jwks = await response.json();
  const key = jwks.keys[0];  // This is just an example, you may need to choose the correct key
  return key;
}
