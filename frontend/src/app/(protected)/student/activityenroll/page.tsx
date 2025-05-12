// src/app/(protected)/student/activityenroll/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOpenActivities } from '@/lib/activity';
import { ActivityWithSkills, Skill } from '@/types/models';
import { formatDateThai } from '@/lib/utils/date';

export default function ActivityEnrollPage() {
  const [activities, setActivities] = useState<ActivityWithSkills[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await getOpenActivities();
        setActivities(res);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'เกิดข้อผิดพลาดในการโหลดกิจกรรม');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const SkillBadge = ({ skill }: { skill: Skill & { skill_level?: number } }) => (
    <span className="rounded bg-gray-200 px-2 py-1 text-[11px] font-medium text-gray-700">
      {skill.name_en} ({skill.skill_type}) ระดับ {skill.skill_level ?? '-'}
    </span>
  );

  if (loading) return <p className="p-4">กำลังโหลดกิจกรรม...</p>;
  if (error) return <p className="p-4 text-red-600">⚠ {error}</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6 bg-[#f5f5f5] min-h-screen">
      <h1 className="text-2xl font-bold">รายการกิจกรรมที่สามารถเข้าร่วมได้</h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {activities.map((a) => (
          <article
            key={a.id}
            className="flex flex-col overflow-hidden rounded-lg shadow-sm ring-1 ring-gray-200 bg-white hover:shadow-md transition"
          >
            <div className="relative h-40 w-full bg-gray-100">
              <Image
                src="/data-science-and-visualization-with-python.jpg"
                alt={a.name}
                fill
                className="object-cover rounded"
              />
            </div>

            <div className="flex flex-1 flex-col p-4">
              <h2 className="text-sm font-semibold">{a.name}</h2>
              <p className="mt-1 text-xs text-gray-500">วันที่จัด: {formatDateThai(a.event_date)}</p>

              <p className="mt-2 text-xs font-medium">ทักษะที่ได้รับ:</p>
              <ul className="mb-4 flex flex-wrap gap-1 mt-1">
                {(a.skills as unknown as string[]).map((s, i) => (
                  <li key={i}>
                    <span className="rounded bg-gray-200 px-2 py-1 text-[11px] font-medium text-gray-700">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>


              <div className="mt-auto flex items-center justify-between gap-2 text-sm">
                <span className="rounded bg-black px-4 py-1 font-semibold text-white">เปิดรับ</span>
                <Link
                  href={`/student/activity/${a.id}`}
                  className="text-red-600 underline-offset-2 hover:underline"
                >
                  รายละเอียด →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
