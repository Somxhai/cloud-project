// src/app/staff/activity/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createActivity, addSkillsToActivity } from '@/lib/activity';

type SkillForm = {
  name: string;
  skill_type: 'soft' | 'hard';
};

export default function CreateActivityPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 0,
    max_amount: 0,
    event_date: '',
  });

  const [skills, setSkills] = useState<SkillForm[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'max_amount' ? Number(value) : value,
    }));
  };

  const handleSkillChange = (index: number, field: keyof SkillForm, value: string) => {
    const newSkills = [...skills];
    newSkills[index][field] = value as any;
    setSkills(newSkills);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newActivity = await createActivity(form);
      await addSkillsToActivity(newActivity.id, skills);
      alert('สร้างกิจกรรมเรียบร้อยแล้ว');
      router.push('/staff/activities');
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">สร้างกิจกรรมใหม่</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="ชื่อกิจกรรม" value={form.name} onChange={handleChange} className="w-full border px-3 py-2" />
        <textarea name="description" placeholder="รายละเอียด" value={form.description} onChange={handleChange} className="w-full border px-3 py-2" />
        <input type="date" name="event_date" value={form.event_date} onChange={handleChange} className="w-full border px-3 py-2" />
        <input type="number" name="max_amount" placeholder="จำนวนผู้เข้าร่วม" value={form.max_amount} onChange={handleChange} className="w-full border px-3 py-2" />
        <select name="status" value={form.status} onChange={handleChange} className="w-full border px-3 py-2">
          <option value={0}>เปิดรับ</option>
          <option value={1}>ปิดรับ</option>
          <option value={2}>ยกเลิก</option>
        </select>

        <div className="space-y-2">
          <p className="font-semibold">ทักษะที่ได้รับ</p>
          {skills.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="text" value={s.name} onChange={(e) => handleSkillChange(i, 'name', e.target.value)} className="border px-2 py-1 w-full" />
              <select value={s.skill_type} onChange={(e) => handleSkillChange(i, 'skill_type', e.target.value)} className="border px-2 py-1">
                <option value="soft">Soft</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          ))}
          <button type="button" onClick={() => setSkills([...skills, { name: '', skill_type: 'hard' }])} className="underline text-sm">
            เพิ่มทักษะ
          </button>
        </div>

        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">บันทึก</button>
      </form>
    </div>
  );
}
