// src/app/(protected)/staff/professor/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  BookOpenCheck,
  GraduationCap,
  BarChart2,
  ArrowRight,
} from 'lucide-react';
import { getStudentsWithSkillsByProfessor } from '@/lib/professor';
import { getCurrentUserId } from '@/lib/auth';

type SkillStatus = 1 | 2 | 3;

type SkillEntry = {
  skill_id: string;
  name_th: string;
  name_en: string;
  status: SkillStatus;
};

type StudentWithSkills = {
  percent: number;
  id: string;
  full_name: string;
  student_code: string;
  year: number;
  curriculum_name: string;
  skills: SkillEntry[];
};

//const professorId = '8950a122-0dc1-4e09-81be-f0bf37368e55';

export default function ProfessorDashboard() {
  const [students, setStudents] = useState<StudentWithSkills[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 1 | 2 | 3 | 4>('all');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const id = await getCurrentUserId();
      setUserId(id);
    };
    load();
  }, []);


  useEffect(() => {
    if (!userId) return;
    getStudentsWithSkillsByProfessor(userId)
      .then(setStudents)
      .finally(() => setLoading(false));
  }, [userId]);

  const getSkillClass = (status: SkillStatus) => {
    switch (status) {
      case 1:
        return 'bg-green-100 text-green-800';
      case 2:
        return 'bg-yellow-100 text-yellow-800';
      case 3:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStudents =
    tab === 'all' ? students : students.filter((s) => s.year === tab);

  if (loading) return <p className="p-6">กำลังโหลดข้อมูล...</p>;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-gray-800">
          <User className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">ภาพรวมนักศึกษาในความดูแล</h1>
        </div>

        <nav className="flex flex-wrap gap-2 text-sm">
          {['all', 1, 2, 3, 4].map((y) => (
            <button
              key={y}
              onClick={() => setTab(y as typeof tab)}
              className={`rounded-full px-4 py-1.5 font-medium transition ${
                tab === y
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {y === 'all' ? 'ทั้งหมด' : `ชั้นปี ${y}`}
            </button>
          ))}
        </nav>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((stu) => (
          <article
            key={stu.id}
            className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition"
          >
            <header className="border-b border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-600">
                    <GraduationCap className="inline h-4 w-4 mr-1 text-indigo-600" />
                    {stu.student_code}
                  </p>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-1">
                    <User className="h-4 w-4 text-blue-600" /> {stu.full_name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    ชั้นปี {stu.year} • {stu.curriculum_name}
                  </p>
                </div>
                <Link
                  href={`/student/profile/${stu.id}`}
                  className="group inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  โปรไฟล์ <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </header>

            <div className="space-y-4 p-4 text-sm">
              <section>
                <h3 className="mb-1 font-medium text-gray-700 flex items-center gap-1">
                  <BarChart2 className="h-4 w-4 text-gray-500" /> ความคืบหน้า
                </h3>
                <div className="flex items-center gap-2">
                  <div className="relative h-3 w-full rounded-full bg-gray-200">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${stu.percent}%` }}
                    />
                  </div>
                  <span className="min-w-[40px] text-right text-xs font-medium text-gray-700">
                    {stu.percent}%
                  </span>
                </div>
              </section>

              <section>
                <h3 className="mb-1 font-medium text-gray-700">ทักษะ</h3>
                <ul className="flex flex-wrap gap-2">
                  {stu.skills.length > 0 ? (
                    stu.skills.map((s) => (
                      <li
                        key={s.skill_id}
                        className={`rounded-full px-3 py-0.5 text-xs ${getSkillClass(s.status)}`}
                      >
                        {s.name_th}
                      </li>
                    ))
                  ) : (
                    <span className="text-gray-400">—</span>
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
