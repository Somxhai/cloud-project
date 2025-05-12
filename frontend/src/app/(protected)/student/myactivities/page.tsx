// src/app/(protected)/student/myactivities/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Hourglass, CalendarCheck, XCircle, CheckCircle2, LucideIcon } from 'lucide-react';
import { getMyActivities } from '@/lib/student';
import type { StudentActivityWithActivityInfo } from '@/types/models';
import { formatDateThai } from '@/lib/utils/date';

/* ------------------------------------------------------------------ */
/* type & meta                                                        */
/* ------------------------------------------------------------------ */
type StatusIndex = 0 | 1 | 2 | 3;

interface StatusInfo {
  label: string;
  color: string; // Tailwind classes
  icon: LucideIcon;
}

const statusMeta: Record<StatusIndex, StatusInfo> = {
  0: { label: 'รออนุมัติ',   color: 'bg-yellow-100 text-yellow-700',   icon: Hourglass },
  1: { label: 'อนุมัติ',     color: 'bg-blue-100 text-blue-700',      icon: CalendarCheck },
  2: { label: 'ไม่อนุมัติ',  color: 'bg-red-100 text-red-700',        icon: XCircle },
  3: { label: 'เข้าร่วมแล้ว', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
};

/* ------------------------------------------------------------------ */
/* hard-coded user (replace with auth)                                */
/* ------------------------------------------------------------------ */
const studentId = 'cac8754c-b80d-4c33-a7c4-1bed9563ee1b';

/* ------------------------------------------------------------------ */
/* component                                                          */
/* ------------------------------------------------------------------ */
export default function MyActivitiesPage() {
  const [activities, setActivities] = useState<StudentActivityWithActivityInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'all' | StatusIndex>('all');

  /* ---------------- fetch ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await getMyActivities(studentId);
        setActivities(res);
      } catch (e: any) {
        setError(e.message || 'โหลดกิจกรรมล้มเหลว');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

    const statusOrder: StatusIndex[] = [0, 1, 2, 3];



  /* ---------------- filter ---------------- */
  const filtered =
    tab === 'all' ? activities : activities.filter((a) => a.status === tab);

  /* ---------------- ui -------------------- */
  return (
    <div className="bg-[#f5f5f5] py-10 px-4">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* headline + filter */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-gray-800">กิจกรรมของฉัน</h1>

          <div className="flex flex-wrap gap-2 text-sm font-medium">
            <button
              onClick={() => setTab('all')}
              className={`rounded-full px-4 py-1.5 shadow ${
                tab === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              ทั้งหมด ({activities.length})
            </button>

    {/* pills */}
    {statusOrder.map((idx) => {
      const meta = statusMeta[idx];
      const isActive = tab === idx;
      return (
        <button
          key={idx}
          onClick={() => setTab(idx)}           // idx เป็น number 0-3
          className={`flex items-center gap-1 rounded-full px-4 py-1.5 shadow
            ${isActive ? meta.color.replace('text', 'bg') : 'bg-white text-gray-700'}`}
        >
          <meta.icon size={14} />
          {meta.label} ({activities.filter((a) => a.status === idx).length})
        </button>
      );
    })}
          </div>
        </header>

        {/* content */}
        {loading ? (
          <p className="text-center text-gray-600">⏳ กำลังโหลด…</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">ไม่พบกิจกรรมในหมวดนี้</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {filtered.map((a) => {
              const meta = statusMeta[a.status as StatusIndex];
              return (
                <li
                  key={a.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="space-y-1">
                    <h2 className="line-clamp-1 text-lg font-semibold text-gray-800">
                      {a.activity_name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      📅 {formatDateThai(a.event_date)}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-medium ${meta.color}`}
                    >
                      <meta.icon size={12} />
                      {meta.label}
                    </span>
                  </div>

                  <Link
                    href={`/student/activity/${a.activity_id}`}
                    className="self-end rounded-full bg-blue-600 px-5 py-1.5 text-sm font-medium text-white shadow hover:bg-blue-700"
                  >
                    ดูรายละเอียด
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
