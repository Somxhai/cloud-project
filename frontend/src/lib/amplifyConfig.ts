import { Amplify } from "aws-amplify";

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId:
				process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ||
				"us-east-1_8GNPgkH7L",
			userPoolClientId:
				process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID ||
				"mlhbqs1lv5q2he96a76enk9sd",
		},
	},
});
