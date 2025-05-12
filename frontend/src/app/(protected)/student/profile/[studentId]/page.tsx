// src/app/(protected)/student/profile/[studentId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  getStudentFullDetail,
  getCompletedActivitiesWithSkills,
} from '@/lib/student';
import { formatDateThaiA } from '@/lib/utils/date';

const PER_PAGE = 4;

/** utility: "foo:3" ➜ { name:"foo",count:3 } */
const parseSkills = (arr: string[] | null | undefined) =>
  arr?.map((t) => {
    const [name, c] = t.split(':');
    return { name, count: Number(c || 0) };
  }) || [];

export default function StudentProfilePage() {
  /* ------------------------------------------------------------------ */
  /* params & state                                                     */
  /* ------------------------------------------------------------------ */
  const { studentId } = useParams() as { studentId: string };
  const [student, setStudent] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  /* ------------------------------------------------------------------ */
  /* fetch                                                              */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!studentId) return;
    (async () => {
      try {
        const [stu, acts] = await Promise.all([
          getStudentFullDetail(studentId),
          getCompletedActivitiesWithSkills(studentId),
        ]);
        setStudent(stu);
        setActivities(acts);
      } catch (e) {
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [studentId]);

  /* ------------------------------------------------------------------ */
  /* derived                                                            */
  /* ------------------------------------------------------------------ */
  const softSkills = parseSkills(student?.Skill_S);
  const hardSkills = parseSkills(student?.Skill_H);

  const totalPages = Math.ceil(activities.length / PER_PAGE);
  const showActs = activities.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );

  /* ------------------------------------------------------------------ */
  /* ui – loading / error                                               */
  /* ------------------------------------------------------------------ */
  if (loading) return <div className="p-6 text-center">⏳ กำลังโหลด…</div>;
  if (!student)
    return <div className="p-6 text-center text-red-600">ไม่พบข้อมูลนักศึกษา</div>;

  /* ------------------------------------------------------------------ */
  /* ui – main                                                          */
  /* ------------------------------------------------------------------ */
  return (
    <div className="px-6 py-10 lg:px-32">
      {/* headline ----------------------------------------------------- */}
      <header>
        <h1 className="text-4xl font-bold text-gray-800">โปรไฟล์</h1>
      </header>

      {/* section: basic info + skills -------------------------------- */}
      <section className="mt-10 grid gap-8 md:grid-cols-2">
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



        {/* skills ---------------------------------------------------- */}
        <article className="rounded-2xl bg-white/90 p-6 shadow">
          <h2 className="mb-4 text-lg font-bold text-gray-800">ทักษะที่มี</h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* soft */}
            <div>
              <h3 className="font-semibold text-gray-700">
                ทักษะด้าน Soft&nbsp;(Soft Skills)
              </h3>
              <p className="mb-2 text-xs text-gray-500">
                ทักษะทางอารมณ์และสังคม
              </p>
              {softSkills.length ? (
                <ul className="space-y-1 text-sm">
                  {softSkills.map((s) => (
                    <li
                      key={s.name}
                      className="flex items-center justify-between rounded-lg bg-gray-100 px-2 py-0.5"
                    >
                      <span>{s.name}</span>
                      <span className="rounded-full bg-gray-300 px-2 text-xs font-medium">
                        {s.count}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-gray-400">—</p>
              )}
            </div>

            {/* hard */}
            <div>
              <h3 className="font-semibold text-gray-700">
                ทักษะด้าน Hard&nbsp;(Hard Skills)
              </h3>
              <p className="mb-2 text-xs text-gray-500">ทักษะทางเทคนิค</p>
              {hardSkills.length ? (
                <ul className="space-y-1 text-sm">
                  {hardSkills.map((s) => (
                    <li
                      key={s.name}
                      className="flex items-center justify-between rounded-lg bg-gray-100 px-2 py-0.5"
                    >
                      <span>{s.name}</span>
                      <span className="rounded-full bg-gray-300 px-2 text-xs font-medium">
                        {s.count}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-gray-400">—</p>
              )}
            </div>
          </div>
        </article>
      </section>

      {/* section: activities ---------------------------------------- */}
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
                  key={act.id}
                  className="overflow-hidden rounded-2xl bg-white shadow"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={
                        act.cover_image_url ||
                        '/data-science-and-visualization-with-python.jpg'
                      }
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
                      {act.skills.map((s: string) => (
                        <li
                          key={s}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700"
                        >
                          {s}
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
