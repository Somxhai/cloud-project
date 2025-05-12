// src/app/(protected)/staff/student/new/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStudent, getAllCurricula } from '@/lib/student';
import type { Curriculum, CreateStudentInput } from '@/types/models';
import {
  UserPlus,
  GraduationCap,
  Phone,
  Mail,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* page                                                               */
/* ------------------------------------------------------------------ */
export default function CreateStudentPage() {
  const router = useRouter();

  /* data */
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CreateStudentInput>({
    user_id: '',
    student_code: '',
    full_name: '',
    faculty: '',
    major: '',
    year: 1,
    curriculum_id: '',
    profile_picture_url: '',
    email: '',
    phone: '',
    gender: 'male',
    birth_date: '',
    line_id: '',
    student_status: 'active',
    is_active: true,
  });

  /* fetch curricula */
  useEffect(() => {
    getAllCurricula().then(setCurricula);
  }, []);

  /* handlers */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? Number(value)
          : type === 'checkbox'
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createStudent({
        ...form,
        curriculum_id: form.curriculum_id || null,
      });
      alert('สร้างนักศึกษาเรียบร้อย');
      router.back();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการสร้างนักศึกษา');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* reusable input */
  const TextInput = ({
    name,
    label,
    type = 'text',
  }: {
    name: keyof CreateStudentInput;
    label: string;
    type?: string;
  }) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name] as string | number}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
      />
    </div>
  );

  /* ------------------------------------------------------------------ */
  /* ui                                                                 */
  /* ------------------------------------------------------------------ */
  return (
    <div className="mx-auto max-w-3xl space-y-10 p-6">
      <header className="flex items-center gap-2 text-2xl font-bold text-gray-800">
        <UserPlus size={24} />
        เพิ่มนักศึกษาใหม่
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* section – ข้อมูลพื้นฐาน */}
        <section className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <ShieldCheck size={18} /> ข้อมูลพื้นฐาน
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput name="user_id" label="User ID" />
            <TextInput name="student_code" label="รหัสนักศึกษา" />
            <TextInput name="full_name" label="ชื่อ-นามสกุล" />
            <TextInput name="profile_picture_url" label="รูปโปรไฟล์ (URL)" />
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">เพศ</label>
              <select
                name="gender"
                value={form.gender || ''}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
              >
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
                <option value="other">อื่น ๆ</option>
              </select>
            </div>
            <TextInput
              name="birth_date"
              label="วันเกิด"
              type="date"
            />
          </div>
        </section>

        {/* section – การติดต่อ */}
        <section className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Phone size={18} /> การติดต่อ
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput name="phone" label="เบอร์โทร" />
            <TextInput name="email" label="E-mail" type="email" />
            <TextInput name="line_id" label="LINE ID" />
          </div>
        </section>

        {/* section – ข้อมูลการศึกษา */}
        <section className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <GraduationCap size={18} /> ข้อมูลการศึกษา
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput name="faculty" label="คณะ" />
            <TextInput name="major" label="สาขา" />
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                ปีการศึกษา
              </label>
              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                หลักสูตร
              </label>
              <select
                name="curriculum_id"
                value={form.curriculum_id || ''}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
              >
                <option value="">— ไม่เลือก —</option>
                {curricula.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                สถานะนักศึกษา
              </label>
              <select
                name="student_status"
                value={form.student_status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
              >
                <option value="active">กำลังศึกษา</option>
                <option value="graduated">จบแล้ว</option>
                <option value="suspended">พ้นสภาพ</option>
              </select>
            </div>
          </div>
        </section>

        {/* section – การเปิดใช้งาน */}
        <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <BookOpen size={18} /> การใช้งานระบบ
          </h2>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="h-4 w-4 accent-blue-600"
            />
            เปิดใช้งาน
          </label>
        </section>

        {/* action */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full bg-gray-200 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            ย้อนกลับ
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-blue-600 px-8 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'กำลังบันทึก…' : 'บันทึก'}
          </button>
        </div>
      </form>
    </div>
  );
}
