'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProfessorById } from '@/lib/professor';
import {
  Mail,
  Phone,
  School,
  Building2,
  Briefcase,
  UserCircle,
  ShieldCheck,
  CalendarClock,
  RefreshCcw,
} from 'lucide-react';

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

  if (loading)
    return <p className="p-6 text-center text-gray-600">⏳ กำลังโหลด...</p>;
  if (!professor)
    return <p className="p-6 text-center text-red-600">❌ ไม่พบข้อมูลอาจารย์</p>;

  const fullDisplayName = professor.position
    ? `${professor.position} ${professor.full_name}`
    : professor.full_name;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <header className="flex flex-col items-center space-y-4">
        {professor.profile_picture_url && (
          <img
            src={professor.profile_picture_url}
            alt="profile"
            className="w-32 h-32 object-cover rounded-full shadow"
          />
        )}
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <UserCircle className="w-6 h-6 text-blue-600" />
          {fullDisplayName}
        </h1>
        <span className="text-sm text-gray-500">User ID: {professor.user_id}</span>
      </header>

      <section className="rounded-2xl bg-white p-6 shadow space-y-4 text-sm text-gray-800">
        <div className="grid sm:grid-cols-2 gap-4">
          <p className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="font-medium">อีเมล:</span> {professor.email || '-'}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="font-medium">เบอร์โทร:</span> {professor.phone || '-'}
          </p>
          <p className="flex items-center gap-2">
            <School className="w-4 h-4 text-gray-500" />
            <span className="font-medium">ภาควิชา:</span> {professor.department || '-'}
          </p>
          <p className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <span className="font-medium">คณะ:</span> {professor.faculty || '-'}
          </p>
          <p className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <span className="font-medium">ตำแหน่ง:</span> {professor.position || '-'}
          </p>
          <p className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gray-500" />
            <span className="font-medium">สถานะบัญชี:</span>{' '}
            <span className={professor.is_active ? 'text-green-600' : 'text-red-600'}>
              {professor.is_active ? 'ใช้งาน' : 'ปิดใช้งาน'}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-gray-500" />
            <span className="font-medium">สร้างเมื่อ:</span>{' '}
            {new Date(professor.created_at).toLocaleString()}
          </p>
          <p className="flex items-center gap-2">
            <RefreshCcw className="w-4 h-4 text-gray-500" />
            <span className="font-medium">แก้ไขล่าสุด:</span>{' '}
            {new Date(professor.updated_at).toLocaleString()}
          </p>
        </div>
      </section>
    </div>
  );
}
