'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser, fetchUserAttributes, signOut, fetchAuthSession } from '@aws-amplify/auth';
import { useRouter } from 'next/navigation';
import '@/lib/amplifyConfig';

type UserInfo = {
  username?: string;
  email?: string;
  role?: 'student' | 'professor' | 'staff' | string;
};

export default function ProfilePage() {
  const [info, setInfo] = useState<UserInfo>({});
  const router = useRouter();

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        await getCurrentUser(); // ถ้าไม่ login จะ throw error
        const attributes = await fetchUserAttributes();
        const session = await fetchAuthSession();
        const payload = session.tokens?.idToken?.payload;

        // ✅ ดึงชื่อผู้ใช้จาก 'cognito:username'
        const username = payload?.['cognito:username'] as string | undefined;

        // ✅ ดึงบทบาทจาก 'cognito:groups'
        let role: string | undefined = undefined;
        const groups = payload?.['cognito:groups'];
        if (Array.isArray(groups) && typeof groups[0] === 'string') {
          role = groups[0];
        } else if (typeof groups === 'string') {
          role = groups;
        }

        setInfo({
          username,
          email: attributes.email || '',
          role: role || 'ไม่ทราบบทบาท',
        });

        console.log('🔍 Payload:', payload);
      } catch (error) {
        router.push('/auth/signin');
      }
    };

    loadUserInfo();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push('/auth/signin');
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">โปรไฟล์ผู้ใช้</h1>

      <div className="bg-white shadow rounded p-4 space-y-2 border border-gray-200">
        <div><span className="font-medium">ชื่อผู้ใช้:</span> {info.username || '-'}</div>
        <div><span className="font-medium">อีเมล:</span> {info.email || '-'}</div>
        <div><span className="font-medium">บทบาท:</span> {info.role || '-'}</div>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors cursor-pointer"
      >
        ออกจากระบบ
      </button>
    </div>
  );
}
