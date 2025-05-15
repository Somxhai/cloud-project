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
import {
  CalendarDays,
  CircleDot,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  FileText,
  FileWarning,
} from 'lucide-react';
import { getMyActivities } from '@/lib/student';
import type { StudentActivityWithActivityInfo } from '@/types/models';
import { formatDateThai } from '@/lib/utils/date';




import { fetchAuthSession } from '@aws-amplify/auth';
import '@/lib/amplifyConfig';


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

  //const studentId = 'cac8754c-b80d-4c33-a7c4-1bed9563ee1b';


  /*
    Cognito session
  */
    const [userId, setUserId] = useState<string | null>(null);
    let [role, setRole] = useState<'student' | 'professor' | 'staff' | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [sessionLoading, setSessionLoading] = useState(true);
    useEffect(() => {
      const loadSessionData = async () => {
        try {
          const session = await fetchAuthSession();
          const token = session.tokens?.idToken?.payload;
  
          console.log('Session token payload:', token);
  
          const sub = token?.sub;
          const displayName = token?.name;
          const rawGroups = token?.['cognito:groups'];
  
          if (sub) setUserId(sub);
          if (typeof displayName === 'string') setName(displayName);
          console.log('userId:', sub);
  
          let roleFromGroup: string | undefined = undefined;
          if (Array.isArray(rawGroups) && typeof rawGroups[0] === 'string') {
            roleFromGroup = rawGroups[0];
          } else if (typeof rawGroups === 'string') {
            roleFromGroup = rawGroups;
          }
  
          if (roleFromGroup && ['student', 'professor', 'staff'].includes(roleFromGroup)) {
            setRole(roleFromGroup as 'student' | 'professor' | 'staff');
          } else {
            setRole(null);
          }
        } catch (err) {
          console.warn('ไม่พบ session หรือยังไม่ได้ login:', err);
          setRole(null);
        } finally {
      setSessionLoading(false);
    }
      };
  
      loadSessionData();
    }, []);


  /*
    Cognito session
  */

  useEffect(() => {
    if (sessionLoading) return;
    if (!userId) {
      setError('ไม่พบรหัสนักศึกษา');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await getMyActivities(userId);
        setActivities(res);
      } catch (e: any) {
        setError(e.message || 'โหลดกิจกรรมล้มเหลว');
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const filtered = activities.filter((a) =>
    statusMeta.find((m) => m.key === tab)?.filter(a)
  );

  return (
    <div className=" min-h-screen py-10 px-4">
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
          <ul className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {filtered.map((a) => {
              const showExtra =
                (a.status === 1 || a.status === 3) && a.activity_status === 3;

              return (
<li
  key={a.id}
  className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
>
  <div className="space-y-3">
    <h2 className="line-clamp-1 text-lg font-bold text-gray-800">{a.activity_name}</h2>

    <div className="flex items-center gap-2 text-sm text-gray-600">
      <CalendarDays className="w-4 h-4 text-gray-400" />
      {formatDateThai(a.event_date)}
    </div>

    <p className="text-sm text-gray-500 line-clamp-2">{a.activity_description}</p>

    {/* สถานะต่าง ๆ */}
    <div className="mt-2 grid gap-2 text-sm text-gray-700">
      <div className="flex items-center gap-2">
        <CircleDot className="w-4 h-4 text-blue-500" />
        สถานะกิจกรรม:
        <span className="font-medium">
          {{
            0: 'เปิดรับ',
            1: 'ปิดรับ',
            2: 'ยกเลิก',
            3: 'เสร็จสิ้น',
          }[a.activity_status]}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {a.status === 1 || a.status === 3 ? (
          <ThumbsUp className="w-4 h-4 text-emerald-500" />
        ) : a.status === 2 ? (
          <ThumbsDown className="w-4 h-4 text-red-500" />
        ) : (
          <CircleDot className="w-4 h-4 text-gray-400" />
        )}
        สถานะการเข้าร่วม:
        <span className="font-medium">
          {{
            0: 'รออนุมัติ',
            1: 'อนุมัติแล้ว',
            2: 'ไม่อนุมัติ',
            3: 'เข้าร่วมแล้ว',
          }[a.status]}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <CircleDot className="w-4 h-4 text-indigo-500" />
        สถานะการยืนยัน:
        <span className="font-medium">
          {{
            0: 'ยังไม่ยืนยัน',
            1: 'ยืนยันแล้ว',
            2: 'ไม่เข้าร่วม',
          }[a.confirmation_status ?? -1] ?? '—'}
        </span>
      </div>
    </div>

    {/* การประเมิน/feedback */}
    {showExtra && (
      <div className="mt-3 grid gap-2 text-sm">
        <div className="flex items-center gap-2">
          {a.evaluation_status === 1 ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          สถานะการประเมินทักษะ:
          <span className="font-medium">
            {a.evaluation_status === 1 ? 'ประเมินแล้ว' : 'ยังไม่ประเมิน'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {a.feedback_submitted ? (
            <FileText className="w-4 h-4 text-green-600" />
          ) : (
            <FileWarning className="w-4 h-4 text-red-500" />
          )}
          แบบประเมินกิจกรรม:
          <span className="font-medium">
            {a.feedback_submitted ? 'ส่งแล้ว' : 'ยังไม่ได้ส่ง'}
          </span>
        </div>
      </div>
    )}
  </div>

  <Link
    href={`/student/activity/${a.activity_id}`}
    className="mt-4 self-end rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
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
