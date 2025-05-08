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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md space-y-6">
        {/* Title / Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">เข้าสู่ระบบ</h1>
          <p className="text-sm text-gray-500 mt-1">กรอกข้อมูลเพื่อเข้าสู่ระบบ</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* Input Fields */}
        <div className="space-y-4">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>

        {/* Link to SignUp */}
        <div className="text-center text-sm text-gray-600">
          ยังไม่มีบัญชี?{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
            สมัครสมาชิก
          </Link>
        </div>
      </div>
    </div>
  );
}
