import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_8GNPgkH7L',
      userPoolClientId: 'mlhbqs1lv5q2he96a76enk9sd', // ← ให้ตรงกับ App client ของ frontend
    }
  }
});
