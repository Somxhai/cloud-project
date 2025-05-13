'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { getStudentsWithSkillsByProfessor } from '@/lib/professor';

type SkillStatus = 1 | 2 | 3;

type SkillEntry = {
  skill_id: string;
  name_th: string;
  name_en: string;
  status: SkillStatus;
};

type StudentWithSkills = {
  percent: any;
  id: string;
  full_name: string;
  student_code: string;
  year: number;
  curriculum_name: string;
  skills: SkillEntry[];
};

const professorId = '8950a122-0dc1-4e09-81be-f0bf37368e55'; // 👈 แก้ตามระบบ login จริงภายหลัง

export default function ProfessorDashboard() {
  const [students, setStudents] = useState<StudentWithSkills[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentsWithSkillsByProfessor(professorId)
      .then(setStudents)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">กำลังโหลดข้อมูล...</p>;

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

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 font-sans">
      <h1 className="text-3xl font-bold mb-8">สรุปนักศึกษาที่อยู่ในความดูแล</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {students.map((stu) => (
          <article
            key={stu.id}
            className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition"
          >
            <header className="border-b border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-600">{stu.student_code}</p>
                  <h2 className="text-lg font-semibold text-gray-900">{stu.full_name}</h2>
                  <p className="text-sm text-gray-500">
                    ชั้นปี {stu.year} • {stu.curriculum_name}
                  </p>
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
  {/* ✅ เพิ่มแถบเปอร์เซ็นต์ */}
  <section>
    <h3 className="mb-1 font-medium text-gray-700">ความคืบหน้าทักษะรวม</h3>
    <div className="flex items-center gap-2">
      <div className="relative h-3 w-full bg-gray-200 rounded-full">
        <div
          className="absolute left-0 top-0 h-full bg-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${stu.percent}%` }}
        />
      </div>
      <span className="text-xs text-gray-700 font-medium min-w-[40px] text-right">{stu.percent}%</span>
    </div>
  </section>

  {/* ✅ ทักษะ */}
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
