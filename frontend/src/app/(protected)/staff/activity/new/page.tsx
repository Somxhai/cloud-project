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
    const updated = [...skills];
    updated[index][field] = value as any;
    setSkills(updated);
  };

  const handleDeleteSkill = (index: number) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
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
      alert('เกิดข้อผิดพลาดในการสร้างกิจกรรม');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">สร้างกิจกรรมใหม่</h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-600 underline"
          >
            ← ย้อนกลับ
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">ชื่อกิจกรรม</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="ชื่อกิจกรรม"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">รายละเอียด</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
              rows={3}
              placeholder="รายละเอียดกิจกรรม"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">วันที่จัดกิจกรรม</label>
            <input
              type="date"
              name="event_date"
              value={form.event_date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">จำนวนผู้เข้าร่วมสูงสุด</label>
            <input
              type="number"
              name="max_amount"
              value={form.max_amount}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">สถานะกิจกรรม</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value={0}>เปิดรับ</option>
              <option value={1}>ปิดรับ</option>
              <option value={2}>ยกเลิก</option>
            </select>
          </div>

          {/* ---------------- ทักษะ ---------------- */}
          <div>
            <label className="block text-sm font-bold mb-1">ทักษะที่ได้รับ</label>
            <div className="space-y-3 bg-gray-50 rounded-md p-3">
              {skills.map((s, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{index + 1}</span>
                  <input
                    type="text"
                    value={s.name}
                    onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                    className="flex-1 border rounded px-2 py-1 text-sm"
                    placeholder="ชื่อทักษะ"
                  />
                  <select
                    value={s.skill_type}
                    onChange={(e) => handleSkillChange(index, 'skill_type', e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="soft">Soft</option>
                    <option value="hard">Hard</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(index)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    ลบ
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSkills([...skills, { name: '', skill_type: 'hard' }])}
                className="text-sm text-center text-blue-600 underline"
              >
                + เพิ่มทักษะ
              </button>
            </div>
          </div>

          {/* ---------------- ปุ่ม ---------------- */}
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm font-medium"
          >
            บันทึก
          </button>
        </form>
      </div>
    </div>
  );
}
