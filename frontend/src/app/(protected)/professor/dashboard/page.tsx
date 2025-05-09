'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { fetchAuthSession } from '@aws-amplify/auth';
import { getStudentsWithSkillsByProfessor } from '@/lib/professor';
import '@/lib/amplifyConfig';

type SkillSummary = string;
type StudentWithSkills = {
  id: string;
  full_name: string;
  student_code: string;
  year: number;
  skills: SkillSummary[];
};



export default function ProfessorDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentWithSkills[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [professorId, setProfessorId] = useState<string | null>(null);
  useEffect(() => {
    const verifyAccessAndFetch = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.payload;
        const rawGroups = token?.['cognito:groups'];
        const groups = Array.isArray(rawGroups) ? rawGroups : typeof rawGroups === 'string' ? [rawGroups] : [];
  
        if (!groups.includes('professor')) {
          setUnauthorized(true);
          return;
        }
  
        const sub = token?.sub;
        if (!sub || typeof sub !== 'string') {
          throw new Error('sub not found in token');
        }
  
        setProfessorId(sub);
  
        const data = await getStudentsWithSkillsByProfessor(sub);
        setStudents(data);
      } catch (err) {
        console.error('Auth error or fetch failed:', err);
        setUnauthorized(true);
      } finally {
        setLoading(false);
      }
    };
  
    verifyAccessAndFetch();
  }, []);
  
  

  if (loading) return <p className="p-6">กำลังโหลดข้อมูล...</p>;
  if (unauthorized) return <p className="p-6 text-red-600">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 font-sans">
      <h1 className="text-3xl font-bold mb-8">สรุปนักศึกษาที่อยู่ในความดูแล</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {students.map((stu) => (
          <article key={stu.id} className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition">
            <header className="border-b border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-600">{stu.student_code}</p>
                  <h2 className="text-lg font-semibold text-gray-900">{stu.full_name}</h2>
                </div>
                <Link
                  href={`/student/profile/${stu.id}`}
                  className="group inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  โปรไฟล์
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </header>
            <div className="space-y-4 p-4">
              <section>
                <h3 className="mb-2 text-sm font-medium text-gray-700">สรุปทักษะ</h3>
                <ul className="flex flex-wrap gap-2">
                  {stu.skills.length > 0 ? (
                    stu.skills.map((skillStr, index) => (
                      <li
                        key={index}
                        className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-700"
                      >
                        {skillStr}
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">ไม่มีข้อมูลทักษะ</p>
                  )}
                </ul>
              </section>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
