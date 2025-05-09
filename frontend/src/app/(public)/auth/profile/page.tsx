'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  signOut,
} from '@aws-amplify/auth';
import { getStudentProfile, getProfessorProfile } from '@/lib/user'; // ✅ API Client ที่คุณต้องสร้าง
import '@/lib/amplifyConfig';

type UserInfo = {
  username?: string;
  email?: string;
  role?: 'student' | 'professor' | 'staff' | string;
};

type StudentProfile = {
  student_code: string;
  full_name: string;
  faculty: string;
  major: string;
  year: number;
};

type ProfessorProfile = {
  full_name: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<UserInfo>({});
  const [studentData, setStudentData] = useState<StudentProfile | null>(null);
  const [professorData, setProfessorData] = useState<ProfessorProfile | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        await getCurrentUser();
        const session = await fetchAuthSession();
        const payload = session.tokens?.idToken?.payload;
        const attributes = await fetchUserAttributes();

        const sub = attributes.sub;
        const username = payload?.['cognito:username'];
        const groups = payload?.['cognito:groups'];
        const role =
          Array.isArray(groups) && typeof groups[0] === 'string'
            ? groups[0]
            : typeof groups === 'string'
            ? groups
            : 'unknown';

        const safeRole = typeof role === 'string' ? role : undefined;

            setInfo({
              username: typeof username === 'string' ? username : undefined,
              email: attributes.email ?? '',
              role: safeRole,
            });
            

        // ✅ Load role-based detail
        if (role === 'student') {
          const data = await getStudentProfile(sub!);
          setStudentData(data);
        } else if (role === 'professor') {
          const data = await getProfessorProfile(sub!);
          setProfessorData(data);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        router.push('/auth/signin');
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push('/auth/signin');
  };

  if (loading) {
    return <div className="p-6 text-center">กำลังโหลดข้อมูลโปรไฟล์...</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">โปรไฟล์ผู้ใช้</h1>

      <div className="bg-white shadow rounded p-4 space-y-2 border">
        <div><strong>ชื่อผู้ใช้:</strong> {info.username}</div>
        <div><strong>อีเมล:</strong> {info.email}</div>
        <div><strong>บทบาท:</strong> {info.role}</div>
      </div>

      {info.role === 'student' && studentData && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 space-y-1">
          <h2 className="font-semibold text-blue-700">ข้อมูลนักศึกษา</h2>
          <div>รหัสนักศึกษา: {studentData.student_code}</div>
          <div>ชื่อ-นามสกุล: {studentData.full_name}</div>
          <div>คณะ: {studentData.faculty}</div>
          <div>สาขา: {studentData.major}</div>
          <div>ชั้นปี: {studentData.year}</div>
        </div>
      )}

      {info.role === 'professor' && professorData && (
        <div className="bg-green-50 border border-green-200 rounded p-4 space-y-1">
          <h2 className="font-semibold text-green-700">ข้อมูลอาจารย์</h2>
          <div>ชื่อ-นามสกุล: {professorData.full_name}</div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        ออกจากระบบ
      </button>
    </div>
  );
}
