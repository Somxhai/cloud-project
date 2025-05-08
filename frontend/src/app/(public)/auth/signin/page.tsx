'use client';
import { useState } from 'react';
import { signIn } from '@aws-amplify/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/lib/amplifyConfig';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signIn({ username, password });
      router.push('/auth/profile');
    } catch (err: any) {
      setError(err.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSignIn();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-5">
        <h1 className="text-2xl font-semibold text-center">เข้าสู่ระบบ</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          className="bg-blue-600 text-white font-medium px-4 py-2 rounded w-full disabled:opacity-60 hover:cursor-pointer" 
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
        <Link href="/auth/signup" className="block text-center text-sm text-gray-600 hover:underline">
        ยังไม่มีบัญชี? สมัครสมาชิก
      </Link>
      </div>
    </div>
  );
}
