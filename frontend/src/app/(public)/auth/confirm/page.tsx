'use client';
import { useState } from 'react';
import { confirmSignUp } from '@aws-amplify/auth';
import '@/lib/amplifyConfig';

export default function ConfirmPage() {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');

  const handleConfirm = async () => {
    try {
      await confirmSignUp({ username, confirmationCode: code });
      alert('ยืนยันสำเร็จ! คุณสามารถเข้าสู่ระบบได้แล้ว');
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="p-4 space-y-2 max-w-md mx-auto">
      <h1 className="text-xl font-bold">ยืนยันรหัสจากอีเมล</h1>
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
        className="bg-green-600 text-white px-4 py-2 w-full"
        onClick={handleConfirm}
      >
        ยืนยัน
      </button>
    </div>
  );
}
