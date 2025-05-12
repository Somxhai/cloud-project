'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { getStudentsWithSkillsSummaryByProfessor } from '@/lib/professor';

type StudentSkillSummary = {
  id: string;
  full_name: string;
  student_code: string;
  year: number;
  skills_have: string[];
  skills_missing: string[];
};

export default function ProfessorDashboard() {
  const [students, setStudents] = useState<StudentSkillSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentsWithSkillsSummaryByProfessor('8950a122-0dc1-4e09-81be-f0bf37368e55').then(setStudents).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">กำลังโหลดข้อมูล...</p>;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 font-sans">
      <h1 className="text-3xl font-bold mb-8">สรุปนักศึกษาที่อยู่ในความดูแล</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {students.map((stu) => (
          <article key={stu.id} className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition ">
            <header className="border-b border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-600">{stu.student_code}</p>
                  <h2 className="text-lg font-semibold text-gray-900">{stu.full_name}</h2>
                  <p className="text-sm text-gray-500">ชั้นปี {stu.year}</p>
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
            <div className="space-y-4 p-4 text-sm">
              <section>
                <h3 className="mb-1 font-medium text-gray-700">✅ ทักษะที่มี</h3>
                <ul className="flex flex-wrap gap-2">
                  {stu.skills_have.length > 0 ? (
                    stu.skills_have.map((skill, i) => (
                      <li key={i} className="bg-green-100 text-green-800 rounded-full px-3 py-0.5 text-xs">
                        {skill}
                      </li>
                    ))
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </ul>
              </section>
              <section>
                <h3 className="mb-1 font-medium text-gray-700">❌ ทักษะที่ขาด</h3>
                <ul className="flex flex-wrap gap-2">
                  {stu.skills_missing.length > 0 ? (
                    stu.skills_missing.map((skill, i) => (
                      <li key={i} className="bg-red-100 text-red-800 rounded-full px-3 py-0.5 text-xs">
                        {skill}
                      </li>
                    ))
                  ) : (
                    <span className="text-gray-400">-</span>
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
