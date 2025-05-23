// src/app/curriculum/[id]/page.tsx
'use client';

import type { CurriculumProgress } from '@/types/models';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  getCurriculumDetail,
  getAllSkills,
  getCurriculumSkills,
  updateCurriculumSkills,
  getCurriculumProgress
} from '@/lib/curriculum';
import type { CurriculumDetail, CurriculumSkillInput, Skill } from '@/types/models';
import {
  BookOpen,
  Users,
  AlertTriangle,
  Loader2,
  Search,
  Pencil,
  Save,
  X,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* page                                                                */
/* ------------------------------------------------------------------ */
export default function CurriculumPage() {
  const { id } = useParams() as { id: string };

  /* ------------------------- base detail (view) -------------------- */
  const [detail, setDetail] = useState<CurriculumDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
const [progress, setProgress] = useState<CurriculumProgress | null>(null);
const [loadingProgress, setLoadingProgress] = useState(true);
  /* ------------------------- edit mode ----------------------------- */
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selected, setSelected] = useState<CurriculumSkillInput[]>([]);
  const [loadingEditData, setLoadingEditData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');

  /* ------------------------------------------------------------------ */
  /* fetch detail (always)                                              */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!id) return;
    setLoadingDetail(true);
    getCurriculumDetail(id)
      .then(setDetail)
      .finally(() => setLoadingDetail(false));
  }, [id]);

useEffect(() => {
   if (!id) return;
  setLoadingProgress(true);
   getCurriculumProgress(id)
     .then(setProgress)
     .finally(() => setLoadingProgress(false));
 }, [id]);
  /* ------------------------------------------------------------------ */
  /* fetch edit-related data (when entering edit)                       */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    const load = async () => {
      setLoadingEditData(true);
      const [skills, current] = await Promise.all([
        getAllSkills(),
        getCurriculumSkills(id),
      ]);
      setAllSkills(skills);
      setSelected(
        current.map((c) => ({
          skill_id: String(c.skill_id),
          required_level: c.required_level,
        })),
      );
      setLoadingEditData(false);
    };
    load();
  }, [mode, id]);

  /* ------------------------------------------------------------------ */
  /* helpers                                                            */
  /* ------------------------------------------------------------------ */
  const isChecked = (sid: string) => selected.some((s) => s.skill_id === sid);
  const levelOf = (sid: string) =>
    selected.find((s) => s.skill_id === sid)?.required_level ?? 1;

  const toggle = (sid: string, check: boolean) =>
    setSelected((prev) =>
      check ? [...prev, { skill_id: sid, required_level: 3 }] : prev.filter((s) => s.skill_id !== sid),
    );

  const changeLevel = (sid: string, lv: number) =>
    setSelected((prev) =>
      prev.map((s) => (s.skill_id === sid ? { ...s, required_level: lv } : s)),
    );

  const save = async () => {
    setSaving(true);
    try {
      await updateCurriculumSkills(id, selected);
      setMode('view');
      // refresh detail afterwards
      const d = await getCurriculumDetail(id);
      setDetail(d);
    } finally {
      setSaving(false);
    }
  };

  const ProgressBar = ({ v = 0 }: { v?: number }) => (
    <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
      <div
        style={{ width: `${v}%` }}
        className="h-full bg-emerald-500 transition-all"
      />
    </div>
  );

  /* ------------------------------------------------------------------ */
  /* ui – loading / error                                               */
  /* ------------------------------------------------------------------ */
  if (loadingDetail || loadingProgress)
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-gray-600">
        <Loader2 className="animate-spin" /> กำลังโหลด…
      </div>
    );
  if (!detail)
    return <div className="p-6 text-red-600">ไม่พบข้อมูลหลักสูตร</div>;

  /* ------------------------------------------------------------------ */
  /* ui – view mode                                                     */
  /* ------------------------------------------------------------------ */
  if (mode === 'view') {
    return (
      <div className="mx-auto max-w-5xl space-y-10 p-6">
        {/* header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">{detail.name}</h1>
          <p className="text-gray-600">{detail.description || 'ไม่มีคำอธิบาย'}</p>
          <button
            onClick={() => setMode('edit')}
            className="inline-flex items-center gap-1 rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow hover:bg-blue-700"
          >
            <Pencil size={16} /> แก้ไขทักษะ
          </button>
        </header>

        {/* skills needed */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <BookOpen size={20} /> ทักษะที่ต้องการ
          </h2>
          {detail.skills?.length ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {detail.skills.map((s) => (
                <li
                  key={s.id}
                  className="rounded-xl bg-white p-4 shadow-sm space-y-1"
                >
                  <p className="font-medium">{s.name_th}</p>
                  <p className="text-xs text-gray-500">ประเภท {s.skill_type}</p>
                  <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                    ต้องการระดับ {s.required_level}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">ยังไม่ได้กำหนดทักษะ</p>
          )}
        </section>

        {/* students summary */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Users size={20} /> สถิตินักศึกษา
          </h2>
          <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">จำนวนนักศึกษา</span>
              <span className="text-xl font-bold">
                {progress?.total_students ?? 0} คน
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">ความคืบหน้าเฉลี่ย</span>
                <span className="font-medium">{progress?.overall_percent ?? 0}%</span>
              </div>
              <ProgressBar v={progress?.overall_percent ?? 0} />
            </div>
          </div>
        </section>

        {/* missing skills */}
{/* missing & completed skills */}
<section className="space-y-6">
  {/* ขาดทักษะ */}
  <div>
    <h2 className="flex items-center gap-2 text-xl font-semibold text-red-700">
      <AlertTriangle size={20} /> ทักษะที่ยังขาดมากที่สุด
    </h2>
    {progress?.gaps?.some((g) => g.units_missing > 0) ? (
      <ul className="grid gap-3 sm:grid-cols-2 mt-3">
        {progress.gaps
          .filter((g) => g.units_missing > 0)
          .sort((a, b) => b.units_missing - a.units_missing)
          .map((g) => (
            <li
              key={g.skill_id}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
            >
              <span>{g.name_th}</span>
              <span className="text-sm text-red-600">
                ขาด {g.units_missing} หน่วย
              </span>
            </li>
          ))}
      </ul>
    ) : (
      <p className="text-gray-500 mt-2">ไม่มีทักษะที่ขาด</p>
    )}
  </div>

  {/* ได้ครบแล้ว */}
  <div>
    <h2 className="flex items-center gap-2 text-xl font-semibold text-green-700">
      <AlertTriangle size={20} className="text-green-700" /> ทักษะที่ได้ครบแล้ว
    </h2>
    {progress?.gaps?.some((g) => g.units_missing === 0) ? (
      <ul className="grid gap-3 sm:grid-cols-2 mt-3">
        {progress.gaps
          .filter((g) => g.units_missing === 0)
          .map((g) => (
            <li
              key={g.skill_id}
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
            >
              <span>{g.name_th}</span>
              <span className="text-sm text-green-600">ครบแล้ว</span>
            </li>
          ))}
      </ul>
    ) : (
      <p className="text-gray-500 mt-2">ยังไม่มีทักษะที่ได้ครบ</p>
    )}
  </div>
</section>

      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* ui – edit mode                                                     */
  /* ------------------------------------------------------------------ */
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      {/* top bar */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">แก้ไขทักษะ – {detail.name}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('view')}
            className="inline-flex items-center gap-1 rounded-lg bg-gray-200 px-4 py-1.5 text-sm text-gray-800 shadow-sm hover:bg-gray-300"
          >
            <X size={16} /> ยกเลิก
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            <Save size={16} /> บันทึก
          </button>
        </div>
      </header>

      {loadingEditData ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-gray-600">
          <Loader2 className="animate-spin" /> กำลังโหลดทักษะ…
        </div>
      ) : (
        <>
          {/* search */}
          <label className="relative block max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาทักษะ"
              className="w-full rounded-lg bg-gray-100 py-1.5 pl-9 pr-3 text-sm focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </label>

          {/* list */}
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allSkills
              .filter(
                (sk) =>
                  sk.name_th.toLowerCase().includes(query.toLowerCase()) ||
                  sk.name_en?.toLowerCase().includes(query.toLowerCase()),
              )
              .map((sk) => {
                const checked = isChecked(sk.id);
                return (
                  <li
                    key={sk.id}
                    className={`flex items-center justify-between rounded-xl p-3 shadow-sm transition ${
                      checked ? 'bg-blue-50/70 shadow-md' : 'bg-white'
                    }`}
                  >
                    <label className="flex flex-1 items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => toggle(sk.id, e.target.checked)}
                        className="h-4 w-4 accent-blue-600"
                      />
                      <span className="truncate">{sk.name_th}</span>
                      <span className="ml-auto rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">
                        {sk.skill_type}
                      </span>
                    </label>

                    {checked && (
                      <select
                        value={levelOf(sk.id)}
                        onChange={(e) => changeLevel(sk.id, Number(e.target.value))}
                        className="ml-2 rounded border px-2 py-1 text-xs"
                      >
                        {[1, 2, 3, 4, 5].map((lv) => (
                          <option key={lv} value={lv}>
                            ระดับ {lv}
                          </option>
                        ))}
                      </select>
                    )}
                  </li>
                );
              })}
          </ul>
        </>
      )}
    </div>
  );
}
