// src/app/staff/curriculum/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCurriculum } from '@/lib/curriculum';
import { Loader2, Plus } from 'lucide-react';

export default function CurriculumCreatePage() {
  /* ------------------------------------------------------------- */
  /* State & router                                                */
  /* ------------------------------------------------------------- */
  const router = useRouter();
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  /* ------------------------------------------------------------- */
  /* Helpers                                                       */
  /* ------------------------------------------------------------- */
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('กรุณาระบุชื่อหลักสูตร');
      return;
    }
    try {
      setSaving(true);
      await createCurriculum(form);
      router.push('/staff/curriculum');
    } catch {
      alert('ไม่สามารถสร้างหลักสูตรได้');
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------------------------------------- */
  /* UI                                                            */
  /* ------------------------------------------------------------- */
  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-6 text-2xl font-bold">เพิ่มหลักสูตรใหม่</h1>

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-lg bg-white p-6 shadow-sm"
      >
        {/* name */}
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            ชื่อหลักสูตร<span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            value={form.name}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
            placeholder="เช่น วิทยาการคอมพิวเตอร์"
          />
        </div>

        {/* description */}
        <div className="space-y-1">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            คำอธิบาย
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={onChange}
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
            placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)"
          />
        </div>

        {/* actions */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                กำลังบันทึก…
              </>
            ) : (
              <>
                <Plus size={16} />
                สร้างหลักสูตร
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
