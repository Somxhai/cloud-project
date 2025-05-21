// src/app/auth/staffsignup/page.tsx
'use client';

import { useState, useEffect  } from 'react';
import { useRouter } from 'next/navigation';
import { signUp, confirmSignUp } from '@aws-amplify/auth';
import '@/lib/amplifyConfig';
import {
  UserPlus,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { deleteCognitoUser } from '@/lib/user';
import { getAuthHeaders } from '@/lib/utils/auth';

export default function StaffSignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const [auth, setAuth] = useState({
    username: '',
    email: '',
    password: '',
    code: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuth((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async () => {
    setError('');
    setLoading(true);
    try {
      await signUp({
        username: auth.username,
        password: auth.password,
        options: {
          userAttributes: { email: auth.email },
        },
      });
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'สมัครสมาชิกไม่สำเร็จ');
    }
    setLoading(false);
  };

  const handleConfirm = async () => {
    setError('');
    setLoading(true);
    try {
      await confirmSignUp({
        username: auth.username,
        confirmationCode: auth.code,
      });

      await fetch('http://localhost:8000/cognito/add-to-group', {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify({ username: auth.username, groupName: 'staff' }),
      });
      setStep(3);
      alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      setConfirmed(true);
      router.push('/auth/signin');
    } catch (err: any) {
      setError(err.message || 'ยืนยันไม่สำเร็จ');
    }
    setLoading(false);
  };

  useEffect(() => {
  const handleBeforeUnload = async () => {
    if (!confirmed && auth.username) {
      try {
        await deleteCognitoUser(auth.username);
        console.log('ลบผู้ใช้จาก Cognito เรียบร้อยแล้ว');
      } catch (err) {
        console.error('ลบผู้ใช้ล้มเหลว', err);
      }
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [auth.username, confirmed]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] from-gray-100 to-blue-100 px-4 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <img src="/logomain.svg" alt="Logo" className="mx-auto h-16 w-auto" />
          <h1 className="text-2xl font-bold text-gray-800">สมัครสมาชิกเจ้าหน้าที่ (Staff)</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 text-sm rounded px-4 py-2 border border-red-300">
            {error}
          </div>
        )}

        {/* Step 1 - Sign Up */}
        {step === 1 && (
          <div className="space-y-4">
            <Input icon={<UserPlus />} name="username" placeholder="Username" onChange={handleChange} />
            <Input icon={<Mail />} name="email" type="email" placeholder="Email" onChange={handleChange} />
            <Input icon={<Lock />} name="password" type="password" placeholder="Password" onChange={handleChange} />
<button
  disabled={loading}
  onClick={handleSignUp}
  className="w-full bg-blue-600 text-white font-semibold py-3 text-base rounded-lg flex justify-center items-center gap-2 hover:bg-blue-700 transition disabled:opacity-60"
>
  <ArrowRight className="w-5 h-5" />
  ดำเนินการสมัคร (ถัดไป)
</button>

<div className="text-center text-sm text-gray-600 pt-2">
  มีบัญชีอยู่แล้วใช่ไหม?{' '}
  <span
    onClick={() => router.push('/auth/signin')}
    className="text-blue-600 font-medium hover:underline cursor-pointer"
  >
    เข้าสู่ระบบ
  </span>
</div>

          </div>
        )}

        {/* Step 2 - Confirm Code */}
        {step === 2 && (
          <div className="space-y-4">
            <Input
              icon={<ShieldCheck />}
              name="code"
              placeholder="กรอกรหัสยืนยันจากอีเมล"
              onChange={handleChange}
            />
<button
  disabled={loading}
  onClick={handleConfirm}
  className="w-full bg-green-600 text-white font-semibold py-3 text-base rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition disabled:opacity-60"
>
  <CheckCircle2 className="w-5 h-5" />
  ยืนยันอีเมล
</button>
          </div>
        )}

        {/* Step 3 - Success */}
        {step === 3 && (
          <div className="text-center text-green-600 font-medium flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8" />
            ✅ สมัครสมาชิกสำเร็จ!
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ helper components ------------------------------ */
function Input({
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }) {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
      {icon && <span className="mr-2 text-gray-400">{icon}</span>}
      <input {...props} className="w-full text-sm bg-transparent focus:outline-none" />
    </div>
  );
}
