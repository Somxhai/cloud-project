'use client';

import { useEffect, useState } from 'react';
import { fetchAuthSession } from '@aws-amplify/auth';
import { useRouter } from 'next/navigation';
import '@/lib/amplifyConfig';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession();
        if (!session.tokens?.idToken) throw new Error('No token');
      } catch (err) {
        router.replace('/auth/signin'); // 🔄 redirect แบบ client
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p className="p-6">กำลังตรวจสอบสิทธิ์...</p>;

  return <>{children}</>;
}
