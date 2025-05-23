
import { fetchAuthSession } from '@aws-amplify/auth';
import '@/lib/amplifyConfig';

export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const session = await fetchAuthSession();
    const sub = session.tokens?.idToken?.payload?.sub;
    return sub ?? null;
  } catch (err) {
    console.warn('ไม่สามารถดึง userId ได้:', err);
    return null;
  }
};


