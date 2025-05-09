'use client';

import { useState } from 'react';
import { confirmSignUp } from '@aws-amplify/auth';
import { useRouter } from 'next/navigation';
import '@/lib/amplifyConfig';
import Link from 'next/link';

export default function ConfirmPage() {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleConfirm = async () => {
    try {
      await confirmSignUp({ username, confirmationCode: code });
      alert('ยืนยันสำเร็จ! คุณสามารถเข้าสู่ระบบได้แล้ว');
      router.push('/auth/profile');
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">ยืนยันอีเมล</h1>
          <p className="text-sm text-gray-500">กรอกรหัสยืนยันที่ส่งไปยังอีเมลของคุณ</p>
        </div>

        <div className="space-y-3">
          <input
            placeholder="Username"
            className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={e => setUsername(e.target.value)}
          />
          <input
            placeholder="Confirmation Code"
            className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={e => setCode(e.target.value)}
          />
        </div>

        <button
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded w-full transition"
          onClick={handleConfirm}
        >
          ยืนยันอีเมล
        </button>

        <div className="text-center">
          <Link href="/auth/signup" className="text-sm text-gray-600 hover:underline">
            กลับไปหน้าสมัครสมาชิก
          </Link>
        </div>
      </div>
    </div>
  );
}
