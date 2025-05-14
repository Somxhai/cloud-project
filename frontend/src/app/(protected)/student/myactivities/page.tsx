// src/app/(protected)/student/myactivities/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Hourglass,
  CalendarCheck,
  XCircle,
  CheckCircle2,
  Ban,
  ClipboardList,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { getMyActivities } from '@/lib/student';
import type { StudentActivityWithActivityInfo } from '@/types/models';
import { formatDateThai } from '@/lib/utils/date';

type TabKey =
  | 'all'
  | 'pending'
  | 'approved_not_confirmed'
  | 'approved_confirmed'
  | 'approved_rejected'
  | 'denied'
  | 'attended'
  | 'not_attended';

interface StatusInfo {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  filter: (a: StudentActivityWithActivityInfo) => boolean;
}

const statusMeta: StatusInfo[] = [
  {
    key: 'all',
    label: 'ทั้งหมด',
    icon: <ClipboardList className="w-4 h-4" />,
    filter: () => true,
  },
  {
    key: 'pending',
    label: 'รออนุมัติ',
    icon: <Hourglass className="w-4 h-4" />,
    filter: (a) => a.status === 0,
  },
  {
    key: 'approved_not_confirmed',
    label: 'ยังไม่ยืนยัน',
    icon: <CalendarCheck className="w-4 h-4" />,
    filter: (a) => a.status === 1 && a.confirmation_status === 0,
  },
  {
    key: 'approved_confirmed',
    label: 'ยืนยันแล้ว',
    icon: <CheckCircle2 className="w-4 h-4" />,
    filter: (a) => a.status === 1 && a.confirmation_status === 1,
  },
  {
    key: 'approved_rejected',
    label: 'ไม่เข้าร่วม',
    icon: <Ban className="w-4 h-4" />,
    filter: (a) => a.status === 1 && a.confirmation_status === 2,
  },
  {
    key: 'denied',
    label: 'ไม่อนุมัติ',
    icon: <XCircle className="w-4 h-4" />,
    filter: (a) => a.status === 2,
  },
  {
    key: 'attended',
    label: 'เข้าร่วมแล้ว',
    icon: <FileCheck className="w-4 h-4" />,
    filter: (a) => a.status === 3 && a.confirmation_status !== 2,
  },
  {
    key: 'not_attended',
    label: 'ไม่ได้เข้าร่วม',
    icon: <AlertCircle className="w-4 h-4" />,
    filter: (a) =>
      (a.status === 3 && a.confirmation_status === 2) ||
      (a.activity_status === 3 && a.status === 1 && a.confirmation_status !== 1),
  },
];

export default function MyActivitiesPage() {
  const [activities, setActivities] = useState<StudentActivityWithActivityInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabKey>('all');

  const studentId = 'cac8754c-b80d-4c33-a7c4-1bed9563ee1b';

  useEffect(() => {
    if (!studentId) {
      setError('ไม่พบรหัสนักศึกษา');
      setLoading(false);
      return;
    }

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
  }, [studentId]);

  const filtered = activities.filter((a) =>
    statusMeta.find((m) => m.key === tab)?.filter(a)
  );

  return (
    <div className="bg-[#f9f9f9] min-h-screen py-10 px-4">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">กิจกรรมของฉัน</h1>

          <div className="flex flex-wrap gap-2">
            {statusMeta.map(({ key, label, icon }) => {
              const isActive = tab === key;
              const count = activities.filter((a) => statusMeta.find((m) => m.key === key)?.filter(a)).length;

              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {icon}
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </header>

        {loading ? (
          <p className="text-center text-gray-600">⏳ กำลังโหลด…</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">ไม่พบกิจกรรมในหมวดนี้</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filtered.map((a) => {
              const showExtra =
                (a.status === 1 || a.status === 3) && a.activity_status === 3;

              return (
<li
  key={a.id}
  className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
>
  <div className="space-y-2">
    <h2 className="line-clamp-1 text-lg font-semibold text-gray-800">
      {a.activity_name}
    </h2>
    <p className="text-sm text-gray-600">📅 {formatDateThai(a.event_date)}</p>
    <p className="text-sm text-gray-500 line-clamp-2">{a.activity_description}</p>

    {/* สถานะต่าง ๆ */}
    <div className="mt-2 space-y-1 text-sm text-gray-700">
      <p>
        <span className="font-medium text-gray-500">สถานะกิจกรรม:</span>{' '}
        <span className="font-semibold">
          {{
            0: 'เปิดรับ',
            1: 'ปิดรับ',
            2: 'ยกเลิก',
            3: 'เสร็จสิ้น',
          }[a.activity_status]}
        </span>
      </p>
      <p>
        <span className="font-medium text-gray-500">สถานะการเข้าร่วม:</span>{' '}
        <span className="font-semibold">
          {{
            0: 'รออนุมัติ',
            1: 'อนุมัติแล้ว',
            2: 'ไม่อนุมัติ',
            3: 'เข้าร่วมแล้ว',
          }[a.status]}
        </span>
      </p>
      <p>
        <span className="font-medium text-gray-500">สถานะการยืนยัน:</span>{' '}
        <span className="font-semibold">
          {{
            0: 'ยังไม่ยืนยัน',
            1: 'ยืนยันแล้ว',
            2: 'ไม่เข้าร่วม',
          }[a.confirmation_status ?? -1] ?? '—'}
        </span>
      </p>
    </div>

    {/* แสดงสถานะการประเมิน/feedback หากกิจกรรมจบ */}
    {showExtra && (
      <div className="mt-2 space-y-1 text-sm text-gray-600">
        <p>
          สถานะการประเมินทักษะ:{' '}
          <strong className={a.evaluation_status === 1 ? 'text-green-600' : 'text-red-500'}>
            {a.evaluation_status === 1 ? '✔️ ประเมินแล้ว' : '❌ ยังไม่ประเมิน'}
          </strong>
        </p>
        <p>
          แบบประเมินกิจกรรม:{' '}
          <strong className={a.feedback_submitted ? 'text-green-600' : 'text-red-500'}>
            {a.feedback_submitted ? '✔️ ส่งแล้ว' : '❌ ยังไม่ได้ส่ง'}
          </strong>
        </p>
      </div>
    )}
  </div>

  <Link
    href={`/student/activity/${a.activity_id}`}
    className="mt-2 self-end rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
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
