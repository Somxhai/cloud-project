'use client';

import { useState } from 'react';
import { signUp } from '@aws-amplify/auth';
import { AuthUser } from 'aws-amplify/auth';
import '@/lib/amplifyConfig';
import { createStudent, createProfessor } from '@/lib/user'; // ✅ API Client

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'professor' | 'staff'>('student');

  // สำหรับ student
  const [studentCode, setStudentCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState(1);

  // สำหรับ professor
  const [professorName, setProfessorName] = useState('');

  const handleSignUp = async () => {
    try {
      const user = await signUp({
        username,
        password,
        options: {
          userAttributes: { email },
        },
      });
      

      alert('สมัครสำเร็จ กรุณายืนยันอีเมล');

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
    <div className="p-4 space-y-3 max-w-md mx-auto">
      <h1 className="text-xl font-bold">สมัครสมาชิก</h1>

      <select className="border p-2 w-full" onChange={(e) => setRole(e.target.value as any)}>
        <option value="student">Student</option>
        <option value="professor">Professor</option>
        <option value="staff">Staff</option>
      </select>

      <input placeholder="Username" className="border p-2 w-full" onChange={e => setUsername(e.target.value)} />
      <input placeholder="Email" className="border p-2 w-full" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="border p-2 w-full" onChange={e => setPassword(e.target.value)} />

      {role === 'student' && (
        <div className="space-y-2">
          <input placeholder="ชื่อ-นามสกุล" className="border p-2 w-full" onChange={(e) => setFullName(e.target.value)} />
          <input placeholder="รหัสนักศึกษา" className="border p-2 w-full" onChange={(e) => setStudentCode(e.target.value)} />
          <input placeholder="คณะ" className="border p-2 w-full" onChange={(e) => setFaculty(e.target.value)} />
          <input placeholder="สาขา" className="border p-2 w-full" onChange={(e) => setMajor(e.target.value)} />
          <input type="number" placeholder="ชั้นปี" className="border p-2 w-full" onChange={(e) => setYear(Number(e.target.value))} />
        </div>
      )}

      {role === 'professor' && (
        <input placeholder="ชื่อ-นามสกุลอาจารย์" className="border p-2 w-full" onChange={(e) => setProfessorName(e.target.value)} />
      )}

      <button className="bg-blue-500 text-white px-4 py-2 w-full" onClick={handleSignUp}>
        สมัคร
      </button>
    </div>
  );
}
