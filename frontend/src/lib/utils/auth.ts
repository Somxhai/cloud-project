import { fetchAuthSession } from '@aws-amplify/auth';

export async function getAccessToken(): Promise<string | null> {
    try {
        const session = await fetchAuthSession();
        const accessToken = session.tokens?.accessToken?.toString();
        return accessToken || null;
    } catch (error) {
        console.error('Error fetching access token:', error);
        return null;
    }
}

export async function getAuthHeaders() {
    const token = await getAccessToken()
    const result: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    if (token) {
        result['Authorization'] = `Bearer ${token}`;
    }

    return result
}

