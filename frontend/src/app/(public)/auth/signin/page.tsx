'use client';

import { useState } from 'react';
import { signIn } from '@aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { fetchAuthSession } from '@aws-amplify/auth';
import { useEffect } from 'react';

import Link from 'next/link';
import '@/lib/amplifyConfig';
import {
  User,
  Lock,
  LogIn,
  AlertCircle,
  Loader2,
  UserPlus,
  XCircle,
  GraduationCap,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

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

  const handleRoleSelect = (role: 'student' | 'professor' | 'staff') => {
    setShowRoleModal(false);
    router.push(`/auth/${role}-signup`);
  };

  useEffect(() => {
  const checkSession = async () => {
    try {
      const session = await fetchAuthSession();
      if (session.tokens?.idToken) {
        router.replace('/auth/profile');
      }
    } catch {
      // No session — do nothing
    }
  };
  checkSession();
}, []);


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6">
        {/* Logo + Title */}
        <div className="text-center space-y-2">
          <img src="/logomain.svg" alt="Logo" className="mx-auto h-16 w-auto" />
          <h1 className="text-3xl font-bold text-gray-800">เข้าสู่ระบบ</h1>
          <p className="text-sm text-gray-500">กรุณากรอกชื่อผู้ใช้และรหัสผ่าน</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded text-sm">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-4">
          <InputField
            icon={<User />}
            value={username}
            placeholder="Username"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <InputField
            icon={<Lock />}
            value={password}
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>กำลังเข้าสู่ระบบ...</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>เข้าสู่ระบบ</span>
            </>
          )}
        </button>

        {/* Sign Up Trigger */}
        <div className="text-center text-sm text-gray-600">
          ยังไม่มีบัญชี?{' '}
          <button
            onClick={() => setShowRoleModal(true)}
            className="text-blue-600 hover:underline font-medium"
          >
            สมัครสมาชิก
          </button>
        </div>
      </div>

      {/* Modal: เลือกบทบาท */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-sm p-6 space-y-4 relative">
            <button
              onClick={() => setShowRoleModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              <XCircle className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-center text-gray-800">เลือกบทบาทในการสมัคร</h2>
            <div className="space-y-3">
              <button
                onClick={() => handleRoleSelect('student')}
                className="w-full flex items-center gap-3 px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                <GraduationCap className="w-5 h-5 text-blue-600" />
                สมัครเป็นนักศึกษา (Student)
              </button>
              <button
                onClick={() => handleRoleSelect('professor')}
                className="w-full flex items-center gap-3 px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                <Briefcase className="w-5 h-5 text-green-600" />
                สมัครเป็นอาจารย์ (Professor)
              </button>
              <button
                onClick={() => handleRoleSelect('staff')}
                className="w-full flex items-center gap-3 px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                สมัครเป็นเจ้าหน้าที่ (Staff)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }) {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
      <span className="mr-2 text-gray-400">{icon}</span>
      <input {...props} className="w-full text-sm bg-transparent focus:outline-none" />
    </div>
  );
}
