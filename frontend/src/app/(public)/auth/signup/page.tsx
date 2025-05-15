'use client';

import { useState } from 'react';
import { signUp } from '@aws-amplify/auth';
import '@/lib/amplifyConfig';
import { createStudent, createProfessor } from '@/lib/user';
import Link from 'next/link';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'professor' | 'staff'>('student');

  const [studentCode, setStudentCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState(1);
  const [professorName, setProfessorName] = useState('');

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      const user = await signUp({
        username,
        password,
        options: {
          userAttributes: { email },
        },
      });

      alert('สมัครสำเร็จ กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ');

      const sub = user.userId;

      if (role === 'student') {
        await createStudent({
          id: sub!,
          user_id: sub!,
          student_code: studentCode,
          full_name: fullName,
          faculty,
          major,
          year: Number(year),
        });
      } else if (role === 'professor') {
        await createProfessor({
          id: sub!,
          user_id: sub!,
          full_name: professorName,
        });
      }
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">สมัครสมาชิก</h1>
          <p className="text-sm text-gray-500">กรุณากรอกข้อมูลให้ครบถ้วน</p>
        </div>

        <select
          className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
        >
          <option value="student">Student</option>
          <option value="professor">Professor</option>
          <option value="staff">Staff</option>
        </select>

        <div className="space-y-3">
          <input
            placeholder="Username"
            className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={e => setUsername(e.target.value)}
          />
          <input
            placeholder="Email"
            className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {role === 'student' && (
          <div className="space-y-3 pt-2">
            <input
              placeholder="ชื่อ-นามสกุล"
              className="border rounded px-3 py-2 w-full text-sm"
              onChange={e => setFullName(e.target.value)}
            />
            <input
              placeholder="รหัสนักศึกษา"
              className="border rounded px-3 py-2 w-full text-sm"
              onChange={e => setStudentCode(e.target.value)}
            />
            <input
              placeholder="คณะ"
              className="border rounded px-3 py-2 w-full text-sm"
              onChange={e => setFaculty(e.target.value)}
            />
            <input
              placeholder="สาขา"
              className="border rounded px-3 py-2 w-full text-sm"
              onChange={e => setMajor(e.target.value)}
            />
            <input
              type="number"
              placeholder="ชั้นปี"
              className="border rounded px-3 py-2 w-full text-sm"
              onChange={e => setYear(Number(e.target.value))}
            />
          </div>
        )}

        {role === 'professor' && (
          <input
            placeholder="ชื่อ-นามสกุลอาจารย์"
            className="border rounded px-3 py-2 w-full text-sm"
            onChange={e => setProfessorName(e.target.value)}
          />
        )}

        <button
          onClick={handleSignUp}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded w-full transition cursor-pointer"
        >
          สมัครสมาชิก
        </button>

        <div className="text-center space-y-1">
          <Link href="/auth/confirm" className="text-sm text-blue-600 hover:underline">
            ไปหน้ายืนยันอีเมล
          </Link>
          <br />
          <Link href="/auth/signin" className="text-sm text-gray-600 hover:underline">
            มีบัญชีอยู่แล้ว? เข้าสู่ระบบที่นี่
          </Link>
        </div>
      </div>
    </div>
  );
}
