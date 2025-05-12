'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createProfessor } from '@/lib/professor';

export default function AddProfessorPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    user_id: '',
    full_name: '',
    email: '',
    phone: '',
    department: '',
    faculty: '',
    position: '',
    profile_picture_url: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProfessor(form);
      alert('เพิ่มอาจารย์เรียบร้อยแล้ว');
      router.push('/staff/professors');
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการเพิ่มอาจารย์');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">เพิ่มอาจารย์ใหม่</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: 'user_id', label: 'User ID' },
          { name: 'full_name', label: 'ชื่อ-นามสกุล' },
          { name: 'email', label: 'อีเมล' },
          { name: 'phone', label: 'เบอร์โทร' },
          { name: 'department', label: 'ภาควิชา' },
          { name: 'faculty', label: 'คณะ' },
          { name: 'position', label: 'ตำแหน่ง' },
          { name: 'profile_picture_url', label: 'รูปภาพ (URL)' },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium mb-1">{f.label}</label>
            <input
              type="text"
              name={f.name}
              value={(form as any)[f.name]}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
              required={f.name === 'user_id' || f.name === 'full_name'}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded"
        >
          {loading ? 'กำลังบันทึก...' : 'บันทึกอาจารย์'}
        </button>
      </form>
    </div>
  );
}
