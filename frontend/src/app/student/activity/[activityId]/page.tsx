'use client';

import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';

/* ------------------------------- mock data ------------------------------- */
type Skill = { name: string; level: number };

type Activity = {
  id: string;
  title: string;
  description: string;
  picture: string;
  status: 'เปิดรับ' | 'ปิดรับ';
  current: number;
  max: number;
  datetime: string;
  skills: Skill[];
};

const mockActivity: Activity = {
  id: 'act1',
  title: 'อบรม Python for Data Science',
  description:
    'กิจกรรมเชิงปฏิบัติการเพื่อศึกษา Python สำหรับการวิเคราะห์ข้อมูลและการสร้างโมเดลเบื้องต้น',
  picture: '/placeholder.svg',
  status: 'เปิดรับ',
  current: 142,
  max: 160,
  datetime: '30 เมษายน 2568 - 14:30',
  skills: [
    { name: 'Python', level: 2 },
    { name: 'Communication', level: 1 },
  ],
};
/* ------------------------------------------------------------------------ */

const SkillBadge = ({ s }: { s: Skill }) => (
  <span className="rounded bg-gray-200 px-1.5 text-[11px] font-medium text-gray-700">
    {s.name} : {s.level}
  </span>
);

export default function ActivityDetailPage() {
  const router = useRouter();
  const { activityId } = useParams(); // ใช้ดึงข้อมูลจริงภายหลัง
  const a = mockActivity;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="rounded-2xl border p-8 shadow-sm">
        {/* header */}
        <h1 className="text-2xl font-bold">{a.title}</h1>
        <h2 className="mt-2 text-base font-semibold">รายละเอียดกิจกรรม</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* left column: text */}
          <p className="text-sm leading-6 text-gray-700">{a.description}</p>

          {/* right column: image */}
          <div className="relative h-52 w-full rounded-lg bg-gray-100">
            <Image
              src={a.picture}
              alt={a.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        {/* info & skills */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* info box */}
          <div className="rounded-lg bg-gray-100 p-6 text-sm">
            <p>
              สถานะ:{' '}
              <span className="font-bold text-green-700">{a.status}</span>
            </p>
            <p>
              ผู้เข้าร่วม: {a.current}/{a.max}
            </p>
            <p>วัน-เวลาจัด {a.datetime}</p>
          </div>

          {/* skills */}
          <div className="rounded-lg bg-gray-100 p-6 text-sm">
            <p className="font-semibold">ทักษะที่ได้</p>
            <ul className="mt-2 flex flex-wrap gap-1">
              {a.skills.map(s => (
                <li key={s.name}>
                  <SkillBadge s={s} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* action buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-full bg-gray-200 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
        >
          ย้อนกลับ
        </button>
        <button className="rounded-full bg-red-500/90 px-6 py-2 text-sm font-semibold text-white hover:bg-red-600">
          ลงทะเบียนเข้าร่วมกิจกรรม
        </button>
      </div>
    </div>
  );
}
