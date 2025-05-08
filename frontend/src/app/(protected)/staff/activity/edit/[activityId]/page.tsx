'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import type { ActivityStatus } from '@/types/models';
import { getActivityById, updateActivity, updateActivitySkills } from '@/lib/activity';

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
    event_date: '', // yyyy-mm-dd
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
          event_date: activity.event_date.slice(0, 10), // ✅ ให้ input type="date" รองรับ
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
    setForm((prev) => {
      let parsed: string | number = value;
      if (name === 'max_amount') {
        parsed = Number(value);
      }
      return { ...prev, [name]: parsed };
    });
  };

  const handleSkillChange = (index: number, field: keyof SkillForm, value: string) => {
    const newSkills = [...skills];
    newSkills[index][field] = value as any;
    setSkills(newSkills);
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
        <div className="flex items-center mb-6">
          <Image src="/antivity2.png" alt="Antivity Icon" width={32} height={32} />
          <h1 className="text-xl font-bold ml-2">แก้ไขกิจกรรม</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">ชื่อกิจกรรม</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">รายละเอียด</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2 text-sm"
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

          <div>
            <label className="block text-sm font-medium mb-1">จำนวนผู้เข้าร่วมสูงสุด</label>
            <input
              type="number"
              name="max_amount"
              value={form.max_amount}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
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

          {/* ----------- ทักษะที่ได้รับ ----------- */}
          <div>
            <label className="block text-sm font-bold mb-1">ทักษะที่ได้รับ</label>
            <div className="space-y-3 bg-gray-100 rounded-md p-3">
              {skills.map((s, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm w-4">{index + 1}</span>
                  <input
                    type="text"
                    className="flex-1 border rounded px-3 py-1 text-sm"
                    value={s.name}
                    onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSkillChange(index, 'skill_type', 'soft')}
                      className={`px-2 py-1 rounded text-sm ${
                        s.skill_type === 'soft' ? 'bg-gray-300' : 'bg-gray-100'
                      }`}
                    >
                      Soft
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSkillChange(index, 'skill_type', 'hard')}
                      className={`px-2 py-1 rounded text-sm ${
                        s.skill_type === 'hard' ? 'bg-gray-300' : 'bg-gray-100'
                      }`}
                    >
                      Hard
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setSkills((prev) => [...prev, { name: '', skill_type: 'hard' }])}
                className="text-sm text-center text-gray-700 underline"
              >
                เพิ่มทักษะ
              </button>
            </div>
          </div>

          {/* ----------- ปุ่ม ----------- */}
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
