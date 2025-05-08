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
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">สมัครสมาชิก</h1>

      <select
        className="border p-2 w-full"
        value={role}
        onChange={(e) => setRole(e.target.value as any)}
      >
        <option value="student">Student</option>
        <option value="professor">Professor</option>
        <option value="staff">Staff</option>
      </select>

      <input placeholder="Username" className="border p-2 w-full" onChange={e => setUsername(e.target.value)} />
      <input placeholder="Email" className="border p-2 w-full" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="border p-2 w-full" onChange={e => setPassword(e.target.value)} />

      {role === 'student' && (
        <div className="space-y-2">
          <input placeholder="ชื่อ-นามสกุล" className="border p-2 w-full" onChange={e => setFullName(e.target.value)} />
          <input placeholder="รหัสนักศึกษา" className="border p-2 w-full" onChange={e => setStudentCode(e.target.value)} />
          <input placeholder="คณะ" className="border p-2 w-full" onChange={e => setFaculty(e.target.value)} />
          <input placeholder="สาขา" className="border p-2 w-full" onChange={e => setMajor(e.target.value)} />
          <input type="number" placeholder="ชั้นปี" className="border p-2 w-full" onChange={e => setYear(Number(e.target.value))} />
        </div>
      )}

      {role === 'professor' && (
        <input placeholder="ชื่อ-นามสกุลอาจารย์" className="border p-2 w-full" onChange={e => setProfessorName(e.target.value)} />
      )}

<button
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 w-full transition-colors cursor-pointer"
  onClick={handleSignUp}
>
  สมัครสมาชิก
</button>

<Link href="/auth/confirm" className="block text-center text-sm text-blue-600 hover:underline">
  ไปหน้ายืนยันอีเมล
</Link>

<Link href="/auth/signin" className="block text-center text-sm text-gray-600 hover:underline">
  มีบัญชีอยู่แล้ว? เข้าสู่ระบบที่นี่
</Link>

      
    </div>
  );
}
