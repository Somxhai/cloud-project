'use client';
import { useState } from 'react';
import { signIn } from '@aws-amplify/auth';
import { useRouter } from 'next/navigation';
import '@/lib/amplifyConfig';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signIn({ username, password });
      router.push('/auth/profile');
    } catch (err: any) {
      alert(err.message || 'เข้าสู่ระบบไม่สำเร็จ');
    }
  };

  return (
    <div className="p-4 space-y-2 max-w-md mx-auto">
      <h1 className="text-xl font-bold">เข้าสู่ระบบ</h1>
      <input
        placeholder="Username"
        className="border p-2 w-full"
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full"
        onChange={e => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 w-full"
        onClick={handleSignIn}
      >
        เข้าสู่ระบบ
      </button>
    </div>
  );
}
