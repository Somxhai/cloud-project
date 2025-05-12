// src/app/staff/curriculum/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurricula, deleteCurriculum } from '@/lib/curriculum';
import type { Curriculum } from '@/types/models';
import { Eye, Pencil, Trash2, Plus, Loader2 } from 'lucide-react';

export default function CurriculumListPage() {
  /* ------------------------------------------------------------------ */
  /* data                                                               */
  /* ------------------------------------------------------------------ */
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurricula()
      .then(setCurricula)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจว่าต้องการลบหลักสูตรนี้?')) return;
    await deleteCurriculum(id);
    setCurricula((prev) => prev.filter((c) => c.id !== id));
  };

  /* ------------------------------------------------------------------ */
  /* ui – loading state                                                 */
  /* ------------------------------------------------------------------ */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-gray-600">
        <Loader2 className="h-5 w-5 animate-spin" />
        กำลังโหลดข้อมูล…
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* ui – main                                                          */
  /* ------------------------------------------------------------------ */
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      {/* header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">รายชื่อหลักสูตร</h1>
        <Link
          href="/staff/curriculum/new"
          className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
        >
          <Plus size={16} /> สร้างหลักสูตร
        </Link>
      </header>

      {/* list / empty state */}
      {curricula.length === 0 ? (
        <p className="text-center text-gray-500">ยังไม่มีหลักสูตร</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {curricula.map((c) => (
            <li
              key={c.id}
              className="flex flex-col justify-between gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              {/* name + desc */}
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">{c.name}</h3>
                <p className="line-clamp-3 text-xs text-gray-600">
                  {c.description || '—'}
                </p>
              </div>

              {/* actions */}
              <div className="mt-2 flex items-center justify-end gap-3 text-sm">
                <Link
                  href={`/staff/curriculum/${c.id}`}
                  title="ดูรายละเอียด"
                  className="text-blue-600 hover:underline"
                >
                  <Eye size={16} />
                </Link>
                <Link
                  href={`/staff/curriculum/${c.id}/edit`}
                  title="แก้ไข"
                  className="text-emerald-600 hover:underline"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(c.id)}
                  title="ลบ"
                  className="text-red-600 hover:underline"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
