'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createActivity, addSkillsToActivity } from '@/lib/activity';
import { getAllSkills } from '@/lib/skill';
import type { Skill } from '@/types/models';
import { getAuthHeaders } from '@/lib/utils/auth';
import Image from 'next/image';
/* ------------------------------------------------------------------ */
/* helpers & reusable inputs                                           */
/* ------------------------------------------------------------------ */
type SelectedSkill = { skill_id: string; skill_level: number };

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  placeholder?: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

function Field({
  label,
  name,
  type = 'text',
  value,
  placeholder,
  onChange,
}: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* page component                                                      */
/* ------------------------------------------------------------------ */
export default function CreateActivityPage() {
  const router = useRouter();
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  /* state ------------------------------------------------------------- */
  const [saving, setSaving] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [chosen, setChosen] = useState<SelectedSkill[]>([]);

  /** keep number/date fields as strings for stable cursor */
  const [form, setForm] = useState({
    name: '',
    description: '',
    details: '',
    event_date: '',
    registration_deadline: '',
    location: '',
    cover_image_url: '',
    max_amount: '',
    status: '0',
    is_published: false,
  });

  /* fetch skills ------------------------------------------------------ */
  useEffect(() => {
    getAllSkills().then(setSkills);
  }, []);

  /* handlers ---------------------------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setProfilePictureFile(file);
  }
};


  const toggleSkill = (id: string, on: boolean) =>
    setChosen((prev) =>
      on ? [...prev, { skill_id: id, skill_level: 3 }] : prev.filter((s) => s.skill_id !== id),
    );

  const levelSkill = (id: string, lv: number) =>
    setChosen((prev) =>
      prev.map((s) => (s.skill_id === id ? { ...s, skill_level: lv } : s)),
    );

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);
  try {
    let imageUrl = form.cover_image_url;

    if (profilePictureFile) {
      const fd = new FormData();
      fd.append('file', profilePictureFile);

      const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/upload-image`,
			{
				method: "POST",
				headers: {
					Authorization: (await getAuthHeaders()).Authorization,
				},

				body: fd,
			}
		);
      if (!res.ok) throw new Error('upload failed');
      const { url } = await res.json();
      imageUrl = url;
    }

    const newAct = await createActivity({
      ...form,
      cover_image_url: imageUrl,
      amount: 0,
      max_amount: Number(form.max_amount) || 0,
      status: Number(form.status),
    });

    await addSkillsToActivity(
      newAct.id,
      chosen.map(({ skill_id, skill_level }) => ({ skill_id, skill_level })),
    );
    alert('สร้างกิจกรรมสำเร็จ');
    router.push('/staff/activities');
  } catch (err) {
    console.error(err);
    alert('เกิดข้อผิดพลาดในการสร้างกิจกรรม');
  } finally {
    setSaving(false);
  }
};


  /* ui ---------------------------------------------------------------- */
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-6 py-10">
      {/* header */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">สร้างกิจกรรมใหม่</h1>
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 underline"
        >
          ← ย้อนกลับ
        </button>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* basic -------------------------------------------------------- */}
        <section className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">ข้อมูลพื้นฐาน</h2>

          <Field
            label="ชื่อกิจกรรม"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              รายละเอียด
            </label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              รายละเอียดการจัดกิจกรรม
            </label>
            <textarea
              name="details"
              rows={4}
              value={form.details}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
            />
          </div>

          {/* cover image */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              รูปภาพปก (อัปโหลด)
            </label>
<input
  type="file"
  accept="image/*"
  onChange={handleFileUpload}
  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
/>
{profilePictureFile && (
  <Image
    width={500}
    height={200}
    src={URL.createObjectURL(profilePictureFile)}
    alt="preview"
    className="mt-2 h-32 rounded"
  />
)}

          </div>
        </section>

        {/* schedule & venue ------------------------------------------- */}
        <section className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">
            กำหนดการ & สถานที่
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="วันที่จัดกิจกรรม"
              name="event_date"
              type="date"
              value={form.event_date}
              onChange={handleChange}
            />
            <Field
              label="ปิดรับสมัคร"
              name="registration_deadline"
              type="date"
              value={form.registration_deadline}
              onChange={handleChange}
            />
            <Field
              label="สถานที่"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
            <Field
              label="จำนวนผู้เข้าร่วมสูงสุด"
              name="max_amount"
              type="number"
              value={form.max_amount}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* publication ------------------------------------------------- */}
        <section className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">
            สถานะ & การเผยแพร่
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                สถานะกิจกรรม
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
              >
                <option value="0">เปิดรับสมัคร</option>
                <option value="1">ปิดรับสมัคร</option>
                <option value="2">ยกเลิก</option>
                <option value="3">เสร็จสิ้น</option>
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
              เผยแพร่ทันที
            </label>
          </div>
        </section>

        {/* skills ------------------------------------------------------ */}
        <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">
            ทักษะที่จะได้รับ
          </h2>
          <div className="grid max-h-64 gap-3 overflow-y-auto sm:grid-cols-2">
            {skills.map((sk) => {
              const picked = chosen.find((c) => c.skill_id === sk.id);
              return (
                <div key={sk.id} className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!picked}
                      onChange={(e) =>
                        toggleSkill(sk.id, e.target.checked)
                      }
                    />
                    {sk.name_th}{' '}
                    <span className="text-xs text-gray-500">
                      ({sk.skill_type})
                    </span>
                  </label>
                  {picked && (
                    <select
                      value={picked.skill_level}
                      onChange={(e) =>
                        levelSkill(sk.id, Number(e.target.value))
                      }
                      className="rounded border px-2 py-1 text-xs"
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
        </section>

        {/* submit ------------------------------------------------------ */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-blue-600 px-8 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'กำลังบันทึก…' : 'บันทึกกิจกรรม'}
          </button>
        </div>
      </form>
    </div>
  );
}
