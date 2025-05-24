'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createActivity, addSkillsToActivity } from '@/lib/activity';
import { getAllSkills } from '@/lib/skill';
import { getAuthHeaders } from '@/lib/utils/auth';
import Image from 'next/image';
import { AlertCircle } from 'lucide-react';
import type { Skill } from '@/types/models';

/* ------------------------------------------------------------------ */
/* Modal Component                                                     */
/* ------------------------------------------------------------------ */
function Modal({
  title,
  contentList,
  onClose,
}: {
  title: string;
  contentList: string[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 h-full w-full">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3 text-red-600">
          <Image src="/logomain.svg" width={140} height={140} alt="logo" />
          <h2 className="text-lg font-semibold">{title}</h2>
          <AlertCircle className="h-6 w-6" />
        </div>
        <ul className="mb-4 ml-8 list-disc text-sm text-gray-800">
          {contentList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page Component                                                     */
/* ------------------------------------------------------------------ */
type SelectedSkill = { skill_id: string; skill_level: number };

export default function CreateActivityPage() {
  const router = useRouter();
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [chosen, setChosen] = useState<SelectedSkill[]>([]);
  const [saving, setSaving] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
const [errors, setErrors] = useState<Record<string, boolean>>({});

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

  useEffect(() => {
    getAllSkills().then(setSkills);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProfilePictureFile(file);
  };

  const toggleSkill = (id: string, on: boolean) =>
    setChosen((prev) =>
      on ? [...prev, { skill_id: id, skill_level: 3 }] : prev.filter((s) => s.skill_id !== id),
    );

  const levelSkill = (id: string, lv: number) =>
    setChosen((prev) =>
      prev.map((s) => (s.skill_id === id ? { ...s, skill_level: lv } : s)),
    );

  const validateForm = () => {
    const requiredFields: [keyof typeof form, string][] = [
      ['name', 'ชื่อกิจกรรม'],
      ['description', 'รายละเอียด'],
      ['event_date', 'วันที่จัดกิจกรรม'],
      ['registration_deadline', 'ปิดรับสมัคร'],
      ['location', 'สถานที่'],
      ['max_amount', 'จำนวนผู้เข้าร่วมสูงสุด'],
    ];

    const missing: string[] = [];
    const newErrors: Record<string, boolean> = {};

    requiredFields.forEach(([key, label]) => {
      if (!form[key]) {
        missing.push(label);
        newErrors[key] = true;
      }
    });

    setMissingFields(missing);
    setErrors(newErrors);

    if (missing.length > 0) {
      setShowModal(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      let imageUrl = form.cover_image_url;

      if (profilePictureFile) {
        const fd = new FormData();
        fd.append('file', profilePictureFile);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/upload-image`, {
          method: 'POST',
          headers: {
            Authorization: (await getAuthHeaders()).Authorization,
          },
          body: fd,
        });

        if (!res.ok) throw new Error('Upload failed');
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

      router.push('/staff/activities');
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการสร้างกิจกรรม');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (name: keyof typeof form) =>
    `w-full rounded-lg border px-3 py-2 text-sm focus:ring-0 ${
      errors[name]
        ? 'border-red-500 focus:border-red-500'
        : 'border-gray-300 focus:border-blue-500'
    }`;

  return (
    <div className="relative mx-auto max-w-4xl px-6 py-10 space-y-10">
      {showModal && (
        <Modal
          title="กรุณากรอกข้อมูลให้ครบถ้วน"
          contentList={missingFields}
          onClose={() => setShowModal(false)}
        />
      )}

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
        {/* ข้อมูลพื้นฐาน */}
        <section className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">ข้อมูลพื้นฐาน</h2>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="ชื่อกิจกรรม"
            className={inputClass('name')}
          />
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="รายละเอียด"
            className={inputClass('description')}
          />
          <textarea
            name="details"
            rows={4}
            value={form.details}
            onChange={handleChange}
            placeholder="รายละเอียดการจัดกิจกรรม"
            className={inputClass('details')}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
        </section>

        {/* กำหนดการ & สถานที่ */}
        <section className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">กำหนดการ & สถานที่</h2>
          <input
            type="date"
            name="event_date"
            value={form.event_date}
            onChange={handleChange}
            className={inputClass('event_date')}
          />
          <input
            type="date"
            name="registration_deadline"
            value={form.registration_deadline}
            onChange={handleChange}
            className={inputClass('registration_deadline')}
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="สถานที่"
            className={inputClass('location')}
          />
          <input
            name="max_amount"
            type="number"
            value={form.max_amount}
            onChange={handleChange}
            placeholder="จำนวนผู้เข้าร่วมสูงสุด"
            className={inputClass('max_amount')}
          />
        </section>

        {/* สถานะ & การเผยแพร่ */}
        <section className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">สถานะ & การเผยแพร่</h2>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className={inputClass('status')}
          >
            <option value="0">เปิดรับสมัคร</option>
            <option value="1">ปิดรับสมัคร</option>
            <option value="2">ยกเลิก</option>
            <option value="3">เสร็จสิ้น</option>
          </select>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_published"
              checked={form.is_published}
              onChange={handleChange}
              className="h-4 w-4 accent-blue-600"
            />
            เผยแพร่ทันที
          </label>
        </section>

        {/* ทักษะ */}
        <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">ทักษะที่จะได้รับ</h2>
          <div className="grid max-h-64 gap-3 overflow-y-auto sm:grid-cols-2">
            {skills.map((sk) => {
              const picked = chosen.find((c) => c.skill_id === sk.id);
              return (
                <div key={sk.id} className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!picked}
                      onChange={(e) => toggleSkill(sk.id, e.target.checked)}
                    />
                    {sk.name_th}
                    <span className="text-xs text-gray-500">({sk.skill_type})</span>
                  </label>
                  {picked && (
                    <select
                      value={picked.skill_level}
                      onChange={(e) => levelSkill(sk.id, Number(e.target.value))}
                      className="rounded border px-2 py-1 text-xs"
                    >
                      {[1, 2, 3, 4, 5].map((lv) => (
                        <option key={lv} value={lv}>ระดับ {lv}</option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        </section>

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
