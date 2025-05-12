'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProfessorById } from '@/lib/professor';
type Professor = {
  id: string;
  user_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  department?: string;
  faculty?: string;
  position?: string;
  profile_picture_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export default function ProfessorProfilePage() {
  const { id } = useParams();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);

        useEffect(() => {
        getProfessorById(id as string)
            .then(setProfessor)
            .catch(() => alert('ไม่สามารถโหลดข้อมูลอาจารย์'))
            .finally(() => setLoading(false));
        }, [id]);

  if (loading) return <p className="p-6">กำลังโหลด...</p>;
  if (!professor) return <p className="p-6 text-red-600">ไม่พบข้อมูลอาจารย์</p>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">โปรไฟล์อาจารย์</h1>
      <div className="bg-white rounded-xl shadow p-6 space-y-3 text-sm text-gray-800">
        {professor.profile_picture_url && (
          <img
            src={professor.profile_picture_url}
            alt="profile"
            className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
          />
        )}
        <p><b>ชื่อ-นามสกุล:</b> {professor.full_name}</p>
        <p><b>User ID:</b> {professor.user_id}</p>
        <p><b>อีเมล:</b> {professor.email || '-'}</p>
        <p><b>เบอร์โทร:</b> {professor.phone || '-'}</p>
        <p><b>ภาควิชา:</b> {professor.department || '-'}</p>
        <p><b>คณะ:</b> {professor.faculty || '-'}</p>
        <p><b>ตำแหน่ง:</b> {professor.position || '-'}</p>
        <p><b>สถานะบัญชี:</b> {professor.is_active ? 'ใช้งาน' : 'ปิดใช้งาน'}</p>
        <p><b>สร้างเมื่อ:</b> {new Date(professor.created_at).toLocaleString()}</p>
        <p><b>แก้ไขล่าสุด:</b> {new Date(professor.updated_at).toLocaleString()}</p>
      </div>
    </div>
  );
}
