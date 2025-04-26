'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';


// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
type SkillSummary = { id: number; name: string; level: number };
type Student = { id: number; name: string; progress: number; skills: SkillSummary[] };

const students: Student[] = [
  {
    id: 63050123,
    name: 'ปรัชญา แสงชัย',
    progress: 65,
    skills: [
      { id: 1, name: 'Communication', level: 3 },
      { id: 2, name: 'Leadership', level: 2 },
      { id: 3, name: 'JavaScript', level: 4 }
    ]
  },
  {
    id: 63050145,
    name: 'ธนกฤต เพ็ญแสง',
    progress: 45,
    skills: [
      { id: 1, name: 'Communication', level: 2 },
      { id: 4, name: 'Teamwork', level: 3 },
      { id: 5, name: 'Python', level: 2 }
    ]
  }
];
// ---------------------------------------------------------------------------

export default function ProfessorDashboard() {
  return (
    
    <main className="mx-auto max-w-6xl px-6 py-10 font-sans ">
      <h1 className="text-3xl font-bold mb-8">สรุปนักศึกษาที่อยู่ในความดูแล</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {students.map((stu) => (
          <article
            key={stu.id}
            className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition"
          >
            {/* header */}
            <header className="border-b border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-600">{stu.id}</p>
                  <h2 className="text-lg font-semibold text-gray-900">{stu.name}</h2>
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

            {/* body */}
            <div className="space-y-4 p-4">
          

              {/* skills */}
              <section>
                <h3 className="mb-2 text-sm font-medium text-gray-700">สรุปทักษะ</h3>
                <ul className="flex flex-wrap gap-2">
                  {stu.skills.map((sk) => (
                    <li
                      key={sk.id}
                      className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-700"
                    >
                      {sk.name}: {sk.level}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
