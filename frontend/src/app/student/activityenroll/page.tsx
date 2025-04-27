'use client';

import Image from 'next/image';

/* ------------------------------- mock data ------------------------------- */
type SkillTag = { name: string; level: number };
type Activity = {
  id: string;
  title: string;
  time: string;
  host: string;
  skills: SkillTag[];
  picture: string;
  isOpen: boolean;
};

const activities: Activity[] = [
  {
    id: 'act1',
    title: 'อบรม Python for Data Science',
    time: '15 มิ.ย. 2568 09:00-16:00',
    host: 'ชมรมวิทยาการข้อมูล',
    skills: [
      { name: 'Python', level: 2 },
      { name: 'Communication', level: 1 },
    ],
    picture: '/placeholder.svg',
    isOpen: true,
  },
  {
    id: 'act2',
    title: 'เวิร์กช็อป Teamwork & Leadership',
    time: '20 มิ.ย. 2568 13:00-17:00',
    host: 'สโมสรนักศึกษา',
    skills: [{ name: 'Teamwork', level: 2 }],
    picture: '/placeholder.svg',
    isOpen: false,
  },
];
/* ------------------------------------------------------------------------ */

const SkillBadge = ({ s }: { s: SkillTag }) => (
  <span className="rounded bg-gray-200 px-1.5 text-[11px] font-medium text-gray-700">
    {s.name} : {s.level}
  </span>
);

export default function ActivityEnrollPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">รายการกิจกรรมที่สามารถเข้าร่วมได้</h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {activities.map(a => (
          <article
            key={a.id}
            className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm"
          >
            {/* image */}
            <div className="relative h-40 w-full bg-gray-100">
              <Image
                src={a.picture}
                fill
                alt={a.title}
                className="object-cover"
              />
            </div>

            {/* details */}
            <div className="flex flex-1 flex-col p-4">
              <h2 className="text-sm font-semibold">{a.title}</h2>
              <p className="mt-1 text-xs text-gray-500">วัน-เวลาจัด: {a.time}</p>
              <p className="text-xs text-gray-500">ผู้จัดกิจกรรม: {a.host}</p>

              <p className="mt-2 text-xs">ทักษะที่ได้ :</p>
              <ul className="mb-4 flex flex-wrap gap-1">
                {a.skills.map(s => (
                  <li key={s.name}>
                    <SkillBadge s={s} />
                  </li>
                ))}
              </ul>

              {/* actions */}
              <div className="mt-auto flex items-center justify-between gap-2 text-sm">
                {a.isOpen ? (
                  <button className="rounded bg-black px-4 py-1 font-semibold text-white hover:bg-gray-800">
                    เปิดรับ
                  </button>
                ) : (
                  <span className="rounded bg-gray-300 px-4 py-1 text-gray-600">
                    ปิดรับ
                  </span>
                )}

                <a
                  href={`/student/activity/${a.id}`}
                  className="text-red-600 underline-offset-2 hover:underline"
                >
                  รายละเอียด →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
