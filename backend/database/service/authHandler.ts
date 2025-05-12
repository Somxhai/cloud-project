import { safeQuery } from '../../lib/utils.ts';

export const getCurrentUserInfo = (sub: string): Promise<unknown> => {
  return safeQuery((_client) => {
    // TODO: query หา user info จาก sub (Cognito)
    return Promise.resolve(null);
  }, 'Failed to get current user info');
};
