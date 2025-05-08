import { Amplify } from 'aws-amplify';

Amplify.configure({
    Auth: {
      Cognito: {
        userPoolClientId: 'mlhbqs1lv5q2he96a76enk9sd',
        userPoolId: 'us-east-1_8GNPgkH7L',
      }
    }
  });
