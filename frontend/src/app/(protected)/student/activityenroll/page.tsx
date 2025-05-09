'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchAuthSession } from '@aws-amplify/auth';
import { getOpenActivities } from '@/lib/activity';
import type { ActivityWithSkills } from '@/types/models';
import { formatDateThai } from '@/lib/utils/date';
import '@/lib/amplifyConfig';

export default function ActivityEnrollPage() {
  const router = useRouter();

  const [activities, setActivities] = useState<ActivityWithSkills[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const session = await fetchAuthSession();
        const rawGroups = session.tokens?.idToken?.payload['cognito:groups'];
        console.log("👀 Token Payload:", session.tokens?.idToken?.payload);
        const groups = Array.isArray(rawGroups)
          ? rawGroups
          : typeof rawGroups === 'string'
          ? [rawGroups]
          : [];

        if (!groups.includes('student')) {
          setUnauthorized(true);
          return;
        }

        const res = await getOpenActivities();
        setActivities(res);
      } catch (err: any) {
        console.error('Auth or data fetch error:', err);
        setError(err.message || 'เกิดข้อผิดพลาดในการโหลดกิจกรรม');
        setUnauthorized(true);
      } finally {
        setLoading(false);
      }
    };

    verifyAccess();
  }, []);

  const SkillBadge = ({ name }: { name: string }) => (
    <span className="rounded bg-gray-200 px-1.5 text-[11px] font-medium text-gray-700">
      {name}
    </span>
  );

  if (loading) return <p className="p-4">กำลังโหลดกิจกรรม...</p>;
  if (unauthorized) return <p className="p-4 text-red-600">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>;
  if (error) return <p className="p-4 text-red-600">⚠ {error}</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">รายการกิจกรรมที่สามารถเข้าร่วมได้</h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {activities.map((a) => (
          <article
            key={a.id}
            className="flex flex-col overflow-hidden rounded-lg shadow-sm ring-1 ring-gray-200 hover:shadow-md transition"
          >
            {/* image */}
            <div className="relative h-40 w-full border-gray-100 p-4 bg-gray-100">
              <Image
                src="/data-science-and-visualization-with-python.jpg"
                alt={a.name}
                fill
                className="object-cover rounded"
              />
            </div>

            {/* details */}
            <div className="flex flex-1 flex-col p-4">
              <h2 className="text-sm font-semibold">{a.name}</h2>
              <p className="mt-1 text-xs text-gray-500">วันที่จัด: {formatDateThai(a.event_date)}</p>

              <p className="mt-2 text-xs">ทักษะที่ได้ :</p>
              <ul className="mb-4 flex flex-wrap gap-1">
                {a.skills.map((s) => (
                  <li key={s}>
                    <SkillBadge name={s} />
                  </li>
                ))}
              </ul>

              {/* actions */}
              <div className="mt-auto flex items-center justify-between gap-2 text-sm">
                <button className="rounded bg-black px-4 py-1 font-semibold text-white hover:bg-gray-800">
                  เปิดรับ
                </button>

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
