// src/app/(protected)/student/activity/[activityId]/page.tsx
'use client';

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  getActivityDetail,
} from '@/lib/activity';
import {
  getStudentActivityStatus,
  joinActivity,
  confirmAttendance,
} from '@/lib/student';
import { formatDateThai } from '@/lib/utils/date';
import type { ActivityWithFullSkills } from '@/types/models';

import {
  Info,
  CalendarDays,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  ClipboardList,
  BadgeCheck,
} from 'lucide-react';

/* ----------------------- label helper ----------------------- */
const statusLabel = ['เปิดรับ', 'ปิดรับ', 'ยกเลิก', 'เสร็จสิ้น'] as const;

/* ------------------------- page ----------------------------- */
export default function StudentActivityDetailPage() {
  const router = useRouter();
  const { activityId } = useParams() as { activityId: string };
  const studentId = 'cac8754c-b80d-4c33-a7c4-1bed9563ee1b'; // TODO – real id from auth

  /* data */
  const [activity, setActivity] = useState<ActivityWithFullSkills | null>(null);
  const [joinStatus, setJoinStatus] = useState<0 | 1 | 2 | 3 | null>(null);
  const [confirmStatus, setConfirmStatus] = useState<0 | 1 | 2 | null>(null);
  const [loading, setLoading] = useState(true);
  const [stateLoading, setStateLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* fetch */
  useEffect(() => {
    (async () => {
      try {
        const a = await getActivityDetail(activityId);
        setActivity(a);
        try {
          const st = await getStudentActivityStatus(studentId, activityId);
          setJoinStatus(st.status as 0 | 1 | 2 | 3);
          setConfirmStatus(st.confirmation_status as 0 | 1 | 2);
        } catch {
          setJoinStatus(null);
          setConfirmStatus(null);
        }
      } catch (e: any) {
        setError(e.message || 'โหลดข้อมูลผิดพลาด');
      } finally {
        setLoading(false);
        setStateLoading(false);
      }
    })();
  }, [activityId]);

  /* utils */
  const inConfirmWindow = (() => {
    if (!activity) return false;
    const now = new Date();
    const eventDate = new Date(activity.event_date);
    const openDate = new Date(eventDate);
    openDate.setDate(
      eventDate.getDate() - (activity.confirmation_days_before_event || 3),
    );
    return now >= openDate && now < eventDate;
  })();

  /* actions */
  const handleJoin = async () => {
    await joinActivity(studentId, activityId);
    setJoinStatus(0);
  };
  const handleConfirm = async (ok: boolean) => {
    await confirmAttendance(studentId, activityId, ok ? 1 : 2);
    setConfirmStatus(ok ? 1 : 2);
  };

  /* loading / error */
  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-600">
        ⏳ กำลังโหลด…
      </div>
    );
  if (error || !activity)
    return (
      <div className="p-6 text-center text-red-600">⚠ {error || 'ไม่พบกิจกรรม'}</div>
    );

  /* ---------------------------------- ui ---------------------------------- */
  return (
    <div className="mx-auto max-w-4xl space-y-10 p-6">
      {/* white card (ไม่มีเส้นขอบ) */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        {/* cover */}
        <div className="relative h-56 w-full">
          <Image
            src={
              activity.cover_image_url ||
              '/data-science-and-visualization-with-python.jpg'
            }
            alt={activity.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end px-6 pb-6">
            <h1 className="text-xl font-bold text-white">{activity.name}</h1>
            <p className="mt-1 line-clamp-2 text-sm text-white/80">
              {activity.description || '—'}
            </p>
          </div>
        </div>

{/* ---------- BODY ---------- */}
<div className="space-y-10 p-6">
  {/* Grid: Info + Schedule */}
  <section className="grid gap-6 sm:grid-cols-2">
    {/* ข้อมูลกิจกรรม */}
    <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
        <Info size={18} /> ข้อมูลกิจกรรม
      </h2>
      <ul className="space-y-1 text-sm text-gray-700">
        <li className="flex items-start gap-2">
          <ClipboardList size={16} className="mt-0.5 text-gray-500" />
          รายละเอียด: {activity.details || '—'}
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle2 size={16} className="mt-0.5 text-gray-500" />
          สถานะ:{' '}
          <span
            className={
              activity.status === 0
                ? 'text-blue-600'
                : activity.status === 3
                ? 'text-emerald-600'
                : 'text-red-600'
            }
          >
            {statusLabel[activity.status]}
          </span>
        </li>
        <li className="flex items-start gap-2">
          <Users size={16} className="mt-0.5 text-gray-500" />
          จำนวนผู้เข้าร่วม: {activity.amount}/{activity.max_amount}
        </li>
        <li className="flex items-start gap-2">
          <MapPin size={16} className="mt-0.5 text-gray-500" />
          สถานที่: {activity.location || '—'}
        </li>
        <li className="flex items-start gap-2">
          <Clock size={16} className="mt-0.5 text-gray-500" />
          สร้างเมื่อ: {formatDateThai(activity.created_at)}
        </li>
        <li className="flex items-start gap-2">
          <Clock size={16} className="mt-0.5 text-gray-500" />
          อัปเดตล่าสุด: {formatDateThai(activity.updated_at)}
        </li>
      </ul>
    </div>

    {/* กำหนดการ */}
    <div className="rounded-xl bg-white p-6 shadow-sm space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
        <CalendarDays size={18} /> กำหนดการ
      </h2>
      <ul className="space-y-1 text-sm text-gray-700">
        <li className="flex items-start gap-2">
          <CalendarDays size={16} className="mt-0.5 text-gray-500" />
          วันจัดกิจกรรม: {formatDateThai(activity.event_date)}
        </li>
        <li className="flex items-start gap-2">
          <Clock size={16} className="mt-0.5 text-gray-500" />
          ปิดรับสมัคร:{' '}
          {activity.registration_deadline
            ? formatDateThai(activity.registration_deadline)
            : '—'}
        </li>
        <li className="flex items-start gap-2">
          <Clock size={16} className="mt-0.5 text-gray-500" />
          ยืนยันล่วงหน้า: {activity.confirmation_days_before_event} วัน
        </li>
        <li className="flex items-start gap-2">
          <Clock size={16} className="mt-0.5 text-gray-500" />
          ยืนยันได้ตั้งแต่:{' '}
          {formatDateThai(
            new Date(
              new Date(activity.event_date).setDate(
                new Date(activity.event_date).getDate() -
                  (activity.confirmation_days_before_event || 3),
              ),
            ).toISOString(),
          )}{' '}
          ถึง {formatDateThai(activity.event_date)}
        </li>
      </ul>
    </div>
  </section>

  {/* ทักษะ */}
  <section className="rounded-xl bg-white p-6 shadow-sm space-y-4">
    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
      <BadgeCheck size={18} /> ทักษะที่จะได้รับ
    </h2>
    {activity.skills.length === 0 ? (
      <p className="text-sm text-gray-500">— ไม่มีทักษะ</p>
    ) : (
      <ul className="flex flex-wrap gap-2">
        {activity.skills.map((s) => (
          <li
            key={s.id}
            className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-700"
          >
            {s.name_th} ({s.skill_type}) – ระดับ {s.skill_level}
          </li>
        ))}
      </ul>
    )}
  </section>
</div>

      </div>

      {/* action buttons – bottom right (นอกกล่อง) */}
      {activity.status === 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-wrap gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-full bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-200"
          >
            ย้อนกลับ
          </button>

          {stateLoading ? (
            <span className="rounded-full bg-gray-100 px-6 py-2 text-sm text-gray-500 shadow">
              ตรวจสอบสถานะ…
            </span>
          ) : joinStatus === null ? (
            <button
              onClick={handleJoin}
              className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
            >
              ลงทะเบียน
            </button>
          ) : joinStatus === 0 ? (
            <span className="rounded-full bg-yellow-100 px-6 py-2 text-sm font-medium text-yellow-700 shadow">
              รออนุมัติ
            </span>
          ) : joinStatus === 2 ? (
            <span className="rounded-full bg-red-100 px-6 py-2 text-sm font-medium text-red-700 shadow">
              ไม่ได้รับการอนุมัติ
            </span>
          ) : joinStatus === 1 && confirmStatus === 0 && inConfirmWindow ? (
            <>
              <button
                onClick={() => handleConfirm(true)}
                className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700"
              >
                ✅ ยืนยัน
              </button>
              <button
                onClick={() => handleConfirm(false)}
                className="rounded-full bg-red-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-red-700"
              >
                ❌ ยกเลิก
              </button>
            </>
          ) : joinStatus === 1 && confirmStatus === 1 ? (
            <span className="rounded-full bg-emerald-100 px-6 py-2 text-sm font-medium text-emerald-700 shadow">
              ยืนยันแล้ว
            </span>
          ) : joinStatus === 1 && confirmStatus === 2 ? (
            <span className="rounded-full bg-red-100 px-6 py-2 text-sm font-medium text-red-700 shadow">
              คุณยกเลิกแล้ว
            </span>
          ) : (
            <span className="rounded-full bg-gray-100 px-6 py-2 text-sm font-medium text-gray-600 shadow">
              เข้าร่วมแล้ว
            </span>
          )}
        </div>
      )}
    </div>
  );
}
