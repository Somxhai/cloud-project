'use client';

import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getActivityDetail } from '@/lib/activity';
import { joinActivity, getStudentActivityStatus } from '@/lib/student';
import type { ActivityWithSkills } from '@/types/models';
import { formatDateThai } from '@/lib/utils/date';
import { fetchAuthSession } from '@aws-amplify/auth';

export default function ActivityDetailPage() {
  const router = useRouter();
  const { activityId } = useParams();
  const [activity, setActivity] = useState<ActivityWithSkills | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   // TODO: ดึงจาก auth จริง
  const [joinStatus, setJoinStatus] = useState<0 | 1 | 2 | 3 | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);



  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const session = await fetchAuthSession();
      const sub = session.tokens?.idToken?.payload.sub;
      console.log('🔑 sub:', sub);
  
      if (typeof sub === 'string') {
        setStudentId(sub); // ✅ เก็บลง state
      }
    };
    load();
  }, []);
  

  // โหลดรายละเอียดกิจกรรม
  useEffect(() => {
    if (!activityId || typeof activityId !== 'string') return;

    const fetchActivity = async () => {
      try {
        const data = await getActivityDetail(activityId);
        setActivity(data);
      } catch (err: any) {
        setError(err.message || 'เกิดข้อผิดพลาด');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [activityId]);

  // โหลดสถานะการเข้าร่วม
  useEffect(() => {
    if (!activityId || typeof activityId !== 'string') return;
    if (!studentId || typeof studentId !== 'string') return;
  
    const fetchStatus = async () => {
      try {
        const result = await getStudentActivityStatus(studentId, activityId);
        if (result) setJoinStatus(result.status);
      } catch (err) {
        console.error('Failed to load join status:', err);
      } finally {
        setStatusLoading(false);
      }
    };
  
    fetchStatus();
  }, [activityId, studentId]); // ✅ ใส่ studentId ด้วย
  

  // ⏳ กำลังโหลดกิจกรรม
  if (loading) return <div className="p-6 text-center">กำลังโหลดข้อมูลกิจกรรม...</div>;
  if (error) return <div className="p-6 text-center text-red-600">⚠ {error}</div>;
  if (!activity) return null;

  const a = activity;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="rounded-2xl border p-8 shadow-sm bg-white">
        <h1 className="text-2xl font-bold">{a.name}</h1>
        <h2 className="mt-1 text-base font-semibold">รายละเอียดกิจกรรม</h2>

        <div className="mt-6 flex flex-col md:flex-row md:items-start md:gap-6">
          <div className="flex-1">
            <p className="text-sm leading-6 text-gray-700">{a.description}</p>
          </div>
          <div className="relative h-52 w-full max-w-sm rounded-2xl bg-gray-100 md:h-40 md:w-80">
            <Image
              src="/data-science-and-visualization-with-python.jpg"
              alt={a.name}
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6 md:flex-row">
          <div className="flex-1 rounded-lg bg-gray-100 p-6 text-sm space-y-2">
            <p>
              สถานะ:{' '}
              <span className="font-bold text-green-700">
                {a.status === 0 ? 'เปิดรับ' : 'ปิด'}
              </span>
            </p>
            <p>
              จำนวนผู้เข้าร่วม: {a.amount} / {a.max_amount}
            </p>
            <p>วัน-เวลาจัด: {formatDateThai(a.event_date)}</p>
          </div>

          <div className="flex-1 rounded-lg bg-gray-100 p-6 text-sm">
            <p className="font-semibold mb-2">ทักษะที่ได้</p>
            <ul className="flex flex-wrap gap-2">
              {a.skills.map((skill, i) => (
                <li
                  key={i}
                  className="rounded bg-slate-200 px-3 py-0.5 text-xs font-medium text-slate-700"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ✅ เงื่อนไขแสดงปุ่มหรือสถานะลงทะเบียน */}
      {a.status === 0 && (
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-full bg-gray-200 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
          >
            ย้อนกลับ
          </button>

          {statusLoading ? (
            <span className="text-sm text-gray-500 px-6 py-2">โปรดรอสักครู่...</span>
          ) : joinStatus === 0 ? (
            <span className="rounded-full bg-yellow-100 px-6 py-2 text-sm font-medium text-yellow-700">
              รอยืนยันการลงทะเบียน
            </span>
          ) : joinStatus === 1 ? (
            <span className="rounded-full bg-green-100 px-6 py-2 text-sm font-medium text-green-700">
              คุณได้ลงทะเบียนแล้ว
            </span>
          ) : joinStatus === 2 ? (
            <span className="rounded-full bg-red-100 px-6 py-2 text-sm font-medium text-red-700">
              การลงทะเบียนไม่ผ่านการอนุมัติ
            </span>
          ) : joinStatus === 3 ? (
            <span className="rounded-full bg-gray-200 px-6 py-2 text-sm font-medium text-gray-600">
              คุณเข้าร่วมกิจกรรมนี้แล้ว
            </span>
          ) : (
            <button
              onClick={async () => {
                try {
                  if (!studentId || typeof studentId !== 'string') {
                    console.warn('❌ ไม่พบ studentId ที่ใช้ได้');
                    return;
                  }
                  await joinActivity(studentId!, activityId as string);
                  alert('ลงทะเบียนเรียบร้อยแล้ว');
                  setJoinStatus(0);
                } catch (err: any) {
                  alert(err.message || 'ลงทะเบียนไม่สำเร็จ');
                }
              }}
              className="rounded-full bg-red-500 px-6 py-2 text-sm font-semibold text-white hover:bg-red-600"
            >
              ลงทะเบียนเข้าร่วมกิจกรรม
            </button>
          )}
        </div>
      )}
    </div>
  );
}
