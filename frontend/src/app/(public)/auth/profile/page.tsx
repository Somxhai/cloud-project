'use client';
import { useEffect, useState } from 'react';
import { getCurrentUser, fetchUserAttributes, signOut } from '@aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { fetchAuthSession } from '@aws-amplify/auth';
import '@/lib/amplifyConfig';

export default function ProfilePage() {
  const [attrs, setAttrs] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        await getCurrentUser(); // throws if not logged in
        const data = await fetchUserAttributes();
        setAttrs(data);
        const session = await fetchAuthSession();
        console.log("👀 Token Payload:", session.tokens?.idToken?.payload);
      } catch {
        router.push('/auth/signin');
      }
    };
    load();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push('/auth/signin');
  };

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-xl font-bold">โปรไฟล์ผู้ใช้</h1>
      <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(attrs, null, 2)}</pre>
      <button className="bg-red-500 text-white px-4 py-2" onClick={handleLogout}>ออกจากระบบ</button>
    </div>
  );
}
