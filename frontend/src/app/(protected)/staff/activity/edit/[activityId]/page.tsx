'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getActivityById, updateActivity, updateActivitySkills } from '@/lib/activity';

type ActivityStatus = 0 | 1 | 2;
type SkillForm = {
  id?: string;
  name: string;
  skill_type: 'soft' | 'hard';
};

export default function EditActivityPage() {
  const { activityId } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 0 as ActivityStatus,
    max_amount: 0,
    amount: 0,
    event_date: '',
  });

  const [skills, setSkills] = useState<SkillForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof activityId !== 'string') return;

    const fetchData = async () => {
      try {
        const activity = await getActivityById(activityId);
        setForm({
          name: activity.name,
          description: activity.description,
          status: activity.status,
          max_amount: activity.max_amount,
          amount: activity.amount,
          event_date: activity.event_date.slice(0, 10),
        });

        setSkills(
          (activity.skills ?? []).map((s: any) => ({
            id: s.id,
            name: s.name,
            skill_type: s.skill_type,
          }))
        );
      } catch (err) {
        console.error(err);
        alert('ไม่สามารถโหลดข้อมูลกิจกรรมได้');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activityId]);

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
    if (typeof activityId !== 'string') return;

    try {
      await updateActivity(activityId, form);
      await updateActivitySkills(activityId, skills);
      alert('อัปเดตกิจกรรมเรียบร้อยแล้ว');
      router.back();
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถอัปเดตกิจกรรมได้');
    }
  };

  if (loading) return <div className="p-6 text-center">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">แก้ไขกิจกรรม</h1>
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
          <div className="flex justify-between gap-2 pt-4">
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm font-medium"
            >
              บันทึก
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded text-sm font-medium"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
