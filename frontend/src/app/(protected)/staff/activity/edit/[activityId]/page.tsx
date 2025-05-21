// src/app/(protected)/staff/activity/[activityId]/edit/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getActivityById, updateActivity } from '@/lib/activity';
import { getAuthHeaders } from '@/lib/utils/auth';
/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */
const emptyForm = {
  name: '',
  description: '',
  details: '',
  event_date: '',
  registration_deadline: '',
  location: '',
  cover_image_url: '',
  max_amount: 0,
  status: 0,
  is_published: false,
};

export default function EditActivityPage() {
  const { activityId } = useParams() as { activityId: string };
  const router = useRouter();

  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const latestImageUrl = useRef<string | null>(null);

  /* ------------------------------------------------------------------ */
  /* fetch activity detail                                              */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    (async () => {
      try {
        const a = await getActivityById(activityId);
        setForm({
          name: a.name,
          description: a.description || '',
          details: a.details || '',
          event_date: a.event_date?.slice(0, 10) || '',
          registration_deadline: a.registration_deadline?.slice(0, 10) || '',
          location: a.location || '',
          cover_image_url: a.cover_image_url || '',
          max_amount: a.max_amount,
          status: a.status,
          is_published: a.is_published,
        });
      } catch (e) {
        alert('โหลดข้อมูลกิจกรรมล้มเหลว');
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [activityId]);

  /* ------------------------------------------------------------------ */
  /* change handlers                                                    */
  /* ------------------------------------------------------------------ */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, type, value } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : ['max_amount', 'status'].includes(name)
          ? Number(value)
          : value,
    }));
  };
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('http://localhost:8000/upload/upload-image', {
      method: 'POST',
      headers: {
        Authorization: (await getAuthHeaders()).Authorization,
      },
      body: formData,
    });

    if (!res.ok) throw new Error('Upload failed');

    const { url } = await res.json();

    // ✅ อัปเดตทั้ง ref และ state
    latestImageUrl.current = url;
    setForm((prev) => ({ ...prev, cover_image_url: url }));
  } catch (err) {
    console.error(err);
    alert('อัปโหลดรูปภาพไม่สำเร็จ');
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);
  try {
    const dataToSend = {
      ...form,
      cover_image_url: latestImageUrl.current || form.cover_image_url,
    };

    await updateActivity(activityId, dataToSend);
    alert('อัปเดตข้อมูลกิจกรรมสำเร็จ');
    router.back();
  } catch (e) {
    alert('ไม่สามารถอัปเดตกิจกรรมได้');
    console.error(e);
  } finally {
    setSaving(false);
  }
};

  /* ------------------------------------------------------------------ */
  /* tiny input component                                               */
  /* ------------------------------------------------------------------ */
  const Field = ({
    label,
    name,
    type = 'text',
  }: {
    label: string;
    name: keyof typeof emptyForm;
    type?: string;
  }) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={String(form[name] ?? '')}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
      />
    </div>
  );

  /* ------------------------------------------------------------------ */
  /* ui – loading                                                       */
  /* ------------------------------------------------------------------ */
  if (loading) return <div className="p-6 text-center">⏳ กำลังโหลด…</div>;

  /* ------------------------------------------------------------------ */
  /* ui – main                                                          */
  /* ------------------------------------------------------------------ */
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-6 py-10">
      {/* header */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">แก้ไขกิจกรรม</h1>
        <button onClick={() => router.back()} className="text-sm text-gray-600 underline">
          ← ย้อนกลับ
        </button>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* basic */}
        <section className="rounded-xl bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">ข้อมูลพื้นฐาน</h2>
          <Field label="ชื่อกิจกรรม" name="name" />
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">รายละเอียด</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">รายละเอียดการจัดกิจกรรม</label>
            <textarea
              name="details"
              rows={4}
              value={form.details}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
            />
          </div>
          <div className="space-y-1">
  <label className="text-sm font-medium text-gray-700">รูปภาพปก (อัปโหลด)</label>
  <input
    type="file"
    accept="image/*"
    onChange={handleFileUpload}
    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
  />
  {form.cover_image_url && (
    <img src={form.cover_image_url} alt="preview" className="h-32 rounded mt-2" />
  )}
</div>

        </section>

        {/* schedule */}
        <section className="rounded-xl bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">กำหนดการ & สถานที่</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="วันจัดกิจกรรม" name="event_date" type="date" />
            <Field label="ปิดรับสมัคร" name="registration_deadline" type="date" />
            <Field label="สถานที่" name="location" />
            <Field label="จำนวนผู้เข้าร่วมสูงสุด" name="max_amount" type="number" />
          </div>
        </section>

        {/* status */}
        <section className="rounded-xl bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">สถานะ & การเผยแพร่</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">สถานะกิจกรรม</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
              >
                <option value={0}>เปิดรับสมัคร</option>
                <option value={1}>ปิดรับสมัคร</option>
                <option value={2}>ยกเลิก</option>
                <option value={3}>เสร็จสิ้น</option>
              </select>
            </div>
            <label className="mt-7 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_published"
                checked={form.is_published}
                onChange={handleChange}
                className="h-4 w-4 accent-blue-600"
              />
              เผยแพร่
            </label>
          </div>
        </section>

        {/* submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-blue-600 px-8 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'กำลังบันทึก…' : 'บันทึกการเปลี่ยนแปลง'}
          </button>
        </div>
      </form>
    </div>
  );
}
