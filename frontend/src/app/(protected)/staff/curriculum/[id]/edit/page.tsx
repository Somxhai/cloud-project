// File: frontend/src/app/curriculum/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getAllSkills, getCurriculumSkills, updateCurriculumSkills } from '@/lib/curriculum';
import type { Skill, CurriculumSkillInput } from '@/types/models';
import { Loader2, Save, Search } from 'lucide-react';

export default function CurriculumEditPage() {
  /* ------------------------------------------------------------------ */
  /* Params & state                                                     */
  /* ------------------------------------------------------------------ */
  const { id } = useParams() as { id: string };
  const curriculumId = id;

  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selected, setSelected] = useState<CurriculumSkillInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');

  /* ------------------------------------------------------------------ */
  /* Helpers                                                            */
  /* ------------------------------------------------------------------ */
  const isChecked = (skillId: string) => selected.some((s) => s.skill_id === skillId);
  const levelOf = (skillId: string) => selected.find((s) => s.skill_id === skillId)?.required_level ?? 1;

  const toggleCheck = (skillId: string, checked: boolean) => {
    setSelected((prev) =>
      checked
        ? [...prev, { skill_id: skillId, required_level: 3 }]
        : prev.filter((s) => s.skill_id !== skillId),
    );
  };

  const changeLevel = (skillId: string, lv: number) =>
    setSelected((prev) =>
      prev.map((s) => (s.skill_id === skillId ? { ...s, required_level: lv } : s)),
    );

  const save = async () => {
    setSaving(true);
    try {
      await updateCurriculumSkills(curriculumId, selected);
      alert('บันทึกสำเร็จ');
    } catch {
      alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Fetch                                                              */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const load = async () => {
      const [skills, current] = await Promise.all([
        getAllSkills(),
        getCurriculumSkills(curriculumId),
      ]);
      setAllSkills(skills);
      setSelected(
        current.map((c) => ({
          skill_id: String(c.skill_id),
          required_level: c.required_level,
        })),
      );
      setLoading(false);
    };
    if (curriculumId) load();
  }, [curriculumId]);

  /* ------------------------------------------------------------------ */
  /* Render                                                             */
  /* ------------------------------------------------------------------ */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-gray-600">
        <Loader2 className="animate-spin" />
        กำลังโหลดข้อมูล…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-8">
      {/* header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">แก้ไขทักษะของหลักสูตร</h1>

        <label className="relative flex items-center">
          <Search size={16} className="absolute left-3 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาทักษะ"
            className="w-60 rounded-lg border py-1.5 pl-9 pr-3 text-sm shadow-sm focus:border-blue-500 focus:ring-0"
          />
        </label>
      </header>

      {/* skill list */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allSkills
          .filter(
            (sk) =>
              sk.name_th.toLowerCase().includes(query.toLowerCase()) ||
              sk.name_en?.toLowerCase().includes(query.toLowerCase()),
          )
          .map((skill) => {
            const checked = isChecked(skill.id);
            return (
              <div
                key={skill.id}
                className={`flex items-center justify-between rounded-xl border p-3 shadow-sm transition
                ${checked ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 bg-white'}`}
              >
                <label className="flex flex-1 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => toggleCheck(skill.id, e.target.checked)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span className="truncate">{skill.name_th}</span>
                  <span className="ml-auto rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">
                    {skill.skill_type}
                  </span>
                </label>

                {checked && (
                  <select
                    value={levelOf(skill.id)}
                    onChange={(e) => changeLevel(skill.id, Number(e.target.value))}
                    className="ml-2 rounded border px-2 py-1 text-xs"
                  >
                    {[1, 2, 3, 4, 5].map((lv) => (
                      <option key={lv} value={lv}>
                        ระดับ {lv}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
      </div>

      {/* save button */}
      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          <Save size={16} />
          บันทึก
        </button>
      </div>
    </div>
  );
}
