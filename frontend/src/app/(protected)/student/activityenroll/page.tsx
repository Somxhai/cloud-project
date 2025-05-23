'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOpenActivities } from '@/lib/activity';
import { ActivityWithSkills, Skill } from '@/types/models';
import { formatDateThai } from '@/lib/utils/date';
import {
  CalendarDays,
  BadgeCheck,
  Eye,
  LayoutList,
} from 'lucide-react';
import Loading from '@/components/Loading';

export default function ActivityEnrollPage() {
  const [activities, setActivities] = useState<ActivityWithSkills[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await getOpenActivities();
        setActivities(res);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'เกิดข้อผิดพลาดในการโหลดกิจกรรม');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const SkillBadge = ({ skill }: { skill: Skill & { skill_level?: number } }) => (
<span className="inline-block rounded-full bg-slate-100 px-2 py-1 text-[11px] leading-tight font-medium text-slate-700">
  {skill.name_en} ({skill.skill_type}) ระดับ {skill.skill_level ?? '-'}
</span>

  );

  if (loading) return <Loading />;
  if (error) return <p className="p-6 text-center text-red-600">⚠ {error}</p>;

  const statusMap = {
    0: { label: 'เปิดรับสมัคร', color: 'bg-green-600' },
    1: { label: 'ปิดรับสมัคร', color: 'bg-gray-500' },
    2: { label: 'ยกเลิก', color: 'bg-red-600' },
    3: { label: 'เสร็จสิ้น', color: 'bg-blue-600' },
  } as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <header className="flex items-center gap-2 text-2xl font-bold text-gray-800">
        <LayoutList className="w-6 h-6 text-blue-600" />
        รายการกิจกรรมที่สามารถเข้าร่วมได้
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {activities.filter((a) => a.is_published).length === 0 ? (
    <div className="col-span-full text-center text-gray-500 py-12 space-y-2">
      <LayoutList className="mx-auto w-10 h-10 text-gray-400" />
      <p className="text-lg font-medium">ขออภัย ขณะนี้ยังไม่มีกิจกรรมเปิดให้ลงทะเบียน</p>
    </div>
  ) : (
        activities
          .filter((a) => a.is_published)
          .map((a) => {
            const status = statusMap[a.status as 0 | 1 | 2 | 3] ?? {
              label: 'ไม่ทราบสถานะ',
              color: 'bg-gray-400',
            };

            return (
              <article
                key={a.id}
                className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md ring-1 ring-gray-200 transition"
              >
                {/* cover image */}
                <div className="relative h-40 w-full bg-gray-100">
                  <Image
                    src= {a.cover_image_url ||
              '/data-science-and-visualization-with-python.jpg'}
                    alt={a.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* content */}
                <div className="flex flex-1 flex-col p-4 space-y-2 text-sm text-gray-700">
                  <h2 className="text-base font-semibold text-gray-800 line-clamp-2">
                    {a.name}
                  </h2>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CalendarDays className="w-4 h-4" />
                    วันที่จัด: {formatDateThai(a.event_date)}
                  </div>

                  <div className="mt-2 text-xs font-medium text-gray-600">
                    <div className="flex items-center gap-1 mb-1">
                      <BadgeCheck className="w-4 h-4" />
                      ทักษะที่ได้รับ:
                    </div>
                      <ul className="flex flex-wrap gap-2 mt-1">
                        {a.skills.map((s) => (
                          <li key={s.id}>
                            <SkillBadge skill={s} />
                          </li>
                        ))}
                      </ul>

                  </div>

                  <div className="mt-auto flex justify-between items-center pt-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${status.color}`}
                    >
                      {status.label}
                    </span>
                    <Link
                      href={`/student/activity/${a.id}`}
                      className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                    >
                      <Eye className="w-4 h-4" />
                      รายละเอียด
                    </Link>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
