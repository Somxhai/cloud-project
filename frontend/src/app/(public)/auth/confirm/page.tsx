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
      router.push('/auth/profile'); // ✅ redirect ไปหน้าโปรไฟล์
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">ยืนยันรหัสจากอีเมล</h1>

      <input
        placeholder="Username"
        className="border p-2 w-full"
        onChange={e => setUsername(e.target.value)}
      />

      <input
        placeholder="Confirmation Code"
        className="border p-2 w-full"
        onChange={e => setCode(e.target.value)}
      />

      <button
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 w-full transition-colors cursor-pointer"
        onClick={handleConfirm}
      >
        ยืนยันอีเมล
      </button>
      <Link href="/auth/signup" className="block text-center text-sm text-gray-600 hover:underline">
        สมัครสมาชิก
      </Link>
    </div>
    
  );
}
