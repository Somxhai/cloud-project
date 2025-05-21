/*
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
*/


// src/app/staff/skill/layout.tsx

// export default function Layout({ children }: { children: React.ReactNode }) {
//   return <>{children}</>;
// }






// app/(protected)/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { fetchAuthSession } from '@aws-amplify/auth';
import Loading from '@/components/Loading';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

useEffect(() => {
  const checkAccess = async () => {
    try {
      
      const session = await fetchAuthSession();

      const hasToken = session.tokens?.idToken;
        if (!hasToken) {
          router.replace('/auth/signin');
          return;
        }

      const rawGroups = session.tokens?.idToken?.payload?.['cognito:groups'];
      const groups = Array.isArray(rawGroups) ? (rawGroups as string[]) : [];

      const path = pathname.toLowerCase();

      // ✅ กำหนด whitelist ของแต่ละ group
      const accessMap: Record<string, string[]> = {
        professor: [
          '/professor',
          '/student/profile', // ✅ professor เข้าหน้านี้ได้
        ],
        staff: ['/staff'],
        student: ['/student'],
      };

      // ✅ ตรวจสอบว่า path ตรงกับ whitelist group ใดบ้าง
      const isAllowed = groups.some((group) => {
        const allowedPaths = accessMap[group] || [];
        return allowedPaths.some((allowedPath) => path.startsWith(allowedPath));
      });

      if (isAllowed) {
        setAllowed(true);
      } else {
        router.replace('/unauthorized');
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  checkAccess();
}, [pathname]);


if (loading) return <Loading full />;

  if (!allowed) return null;

  return <>{children}</>;
}
