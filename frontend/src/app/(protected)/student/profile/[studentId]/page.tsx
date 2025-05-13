'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  getStudentProgress,           // 👉 ใหม่ – เรียก /progress/student/:id
  getStudentActivityHistory,
  getStudentFullDetail    // 👉 ใหม่ – เรียก /progress/student/:id/activity-history
} from '@/lib/student';
import { formatDateThaiA } from '@/lib/utils/date';

const PER_PAGE = 4;

/* ------------------------------------------------------------------ */
/* ui helper – render skill list                                       */
/* ------------------------------------------------------------------ */
type SkillEntry = { name_th: string; name_en: string; level_have: number; level_required: number };

function SkillList({ title, items }: { title: string; items: SkillEntry[] }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-700">{title}</h3>
      {items.length ? (
        <ul className="mt-2 space-y-1 text-sm">
          {items.map((s) => (
            <li
              key={s.name_en}
              className="flex items-center justify-between rounded-lg bg-gray-100 px-2 py-0.5"
            >
              <span>{s.name_th}</span>
              <span className="rounded-full bg-gray-300 px-2 text-xs font-medium">
                {s.level_have}/{s.level_required}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="italic text-gray-400">—</p>
      )}
    </div>
  );
}

export default function StudentProfilePage() {
  const { studentId } = useParams() as { studentId: string };

  const [progress, setProgress] = useState<any>(null);     // ✓ มี field student, completed, partial, missing
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
const [student, setStudent] = useState<any>(null);     // 👉 เพิ่ม
  /* ------------------------------------------------------------------ */
  /* fetch                                                              */
  /* ------------------------------------------------------------------ */
useEffect(() => {
  if (!studentId) return;
  (async () => {
    try {
      const [stu, prog, acts] = await Promise.all([
        getStudentFullDetail(studentId),           // ✅ ใหม่
        getStudentProgress(studentId),
        getStudentActivityHistory(studentId),
      ]);
      setStudent(stu);                             // ✅ เก็บข้อมูลพื้นฐานจาก full detail
      setProgress(prog);
      setActivities(acts);
    } catch (e) {
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      console.error(e);
    } finally {
      setLoading(false);
    }
  })();
}, [studentId]);

  if (loading) return <div className="p-6 text-center">⏳ กำลังโหลด…</div>;
  if (!progress)
    return <div className="p-6 text-center text-red-600">ไม่พบข้อมูลนักศึกษา</div>;

  const { percent, units_have, units_required, completed, partial, missing } = progress;
  const totalPages = Math.ceil(activities.length / PER_PAGE);
  const showActs = activities.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /* ------------------------------------------------------------------ */
  /* ui – main                                                          */
  /* ------------------------------------------------------------------ */
  return (
    <div className="px-6 py-10 lg:px-32">
      {/* headline */}
      <header>
        <h1 className="text-4xl font-bold text-gray-800">โปรไฟล์</h1>
      </header>

      {/* basic info + skills */}
      <section className="mt-10 grid gap-8 md:grid-cols-2">
        {/* info */}
        {/* info ------------------------------------------------------ */}
<article className="rounded-2xl bg-white/90 p-6 shadow">
  <h2 className="mb-6 text-lg font-bold text-gray-800">ข้อมูลนักศึกษา</h2>

  <div className="grid gap-8 md:grid-cols-3">
    {/* ───── หมวดพื้นฐาน ───── */}
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-600">พื้นฐาน</h3>
      {[
        ['ชื่อ-นามสกุล', student.full_name],
        ['รหัสนักศึกษา', student.student_code],
        ['วันเกิด', formatDateThaiA(student.birth_date || '—')],
        ['สถานะ', student.student_status],
      ].map(([label, value]) => (
        <div key={label}>
          <dt className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            {label}
          </dt>
          <dd className="text-sm text-gray-800">{value}</dd>
        </div>
      ))}
    </section>

    {/* ───── หมวดการติดต่อ ───── */}
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-600">การติดต่อ</h3>
      {[
        ['อีเมล', student.email],
        ['เบอร์โทร', student.phone],
        ['LINE ID', student.line_id || '—'],
      ].map(([label, value]) => (
        <div key={label}>
          <dt className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            {label}
          </dt>
          <dd className="text-sm text-gray-800 break-words">{value}</dd>
        </div>
      ))}
    </section>

    {/* ───── หมวดการศึกษา ───── */}
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-600">การศึกษา</h3>
      {[
        ['หลักสูตร', student.curriculum_name],
        ['คณะ', student.faculty],
        ['สาขา', student.major],
        ['ชั้นปี', student.year],
        ['ที่ปรึกษา', student.professor_name || '—'],
      ].map(([label, value]) => (
        <div key={label}>
          <dt className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
            {label}
          </dt>
          <dd className="text-sm text-gray-800">{value}</dd>
        </div>
      ))}
    </section>
  </div>
</article>

        {/* skills – แบ่งสามส่วน */}
        <article className="rounded-2xl bg-white/90 p-6 shadow">
  <h2 className="mb-6 text-lg font-bold text-gray-800">ภาพรวมทักษะ</h2>

  {/* ✅ เพิ่มความคืบหน้า */}
  <section className="mb-6">
    <p className="text-sm text-gray-700">
      ความคืบหน้า: 
      <span className="ml-2 font-semibold text-indigo-700">
        {percent}% ({units_have}/{units_required} หน่วย)
      </span>
    </p>
    <div className="relative mt-2 h-3 bg-gray-200 rounded-full">
      <div
        className="absolute top-0 left-0 h-full bg-indigo-600 rounded-full transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  </section>

  {/* รายการทักษะแบ่ง 3 หมวด */}
  <div className="space-y-6">
    <div>
      <h3 className="mb-2 font-semibold text-green-700">สำเร็จแล้ว</h3>
      <div className="grid gap-6 sm:grid-cols-2">
        <SkillList title="Hard Skills" items={completed.hard} />
        <SkillList title="Soft Skills" items={completed.soft} />
      </div>
    </div>

    <div>
      <h3 className="mb-2 font-semibold text-yellow-700">กำลังพัฒนา</h3>
      <div className="grid gap-6 sm:grid-cols-2">
        <SkillList title="Hard Skills" items={partial.hard} />
        <SkillList title="Soft Skills" items={partial.soft} />
      </div>
    </div>

    <div>
      <h3 className="mb-2 font-semibold text-red-700">ยังไม่เริ่ม</h3>
      <div className="grid gap-6 sm:grid-cols-2">
        <SkillList title="Hard Skills" items={missing.hard} />
        <SkillList title="Soft Skills" items={missing.soft} />
      </div>
    </div>
  </div>
</article>

      </section>

      {/* activities */}
      <section className="mt-14">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          กิจกรรมที่เคยเข้าร่วม
        </h2>

        {activities.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีกิจกรรมที่เสร็จสิ้น</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {showActs.map((act) => (
                <article
                  key={act.activity_id}
                  className="overflow-hidden rounded-2xl bg-white shadow"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={act.cover_image_url || '/data-science-and-visualization-with-python.jpg'}
                      alt={act.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-2 p-4">
                    <h3 className="line-clamp-2 text-sm font-semibold text-gray-800">
                      {act.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      วันที่เข้าร่วม: {formatDateThaiA(act.event_date)}
                    </p>
                    <ul className="flex flex-wrap gap-1">
                      {act.skills.map((s: any) => (
                        <li
                          key={s.skill_id}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700"
                        >
                          {s.name_th}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="mt-6 flex justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`rounded-full px-4 py-1.5 text-sm transition ${
                        page === p
                          ? 'bg-gray-900 text-white'
                          : 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
}
