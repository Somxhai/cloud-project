// src/app/auth/studentsignup/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signUp, confirmSignUp } from '@aws-amplify/auth';
import { checkStudentCodeExists, createStudent, getAllCurricula } from '@/lib/student';
import type { Curriculum } from '@/types/models';
import {
  UserPlus,
  BookOpen,
  Phone,
  Mail,
  Calendar,
  ImageIcon,
  Lock,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
} from 'lucide-react';

export default function StudentSignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const userSubRef = useRef<string | null>(null);

  useEffect(() => {
    getAllCurricula().then(setCurricula);
  }, []);

  const [form, setForm] = useState({
    student_code: '',
    full_name: '',
    faculty: '',
    major: '',
    year: '1',
    curriculum_id: '',
    phone: '',
    email: '',
    line_id: '',
    birth_date: '',
    gender: 'male',
    profile_picture_url: '',
  });

  const [auth, setAuth] = useState({
    username: '',
    password: '',
    code: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuth((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePictureFile(file);
  };

  const handleNext = async () => {
    setError('');
    setLoading(true);
    try {
      const exists = await checkStudentCodeExists(form.student_code);
      if (exists) {
        setError('รหัสนักศึกษานี้ถูกใช้แล้ว');
      } else {
        setStep(2);
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการตรวจสอบรหัสนักศึกษา');
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await signUp({
        username: auth.username,
        password: auth.password,
        options: { userAttributes: { email: form.email } },
      });
      userSubRef.current = user.userId ?? null;
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'สมัครสมาชิกไม่สำเร็จ');
    }
    setLoading(false);
  };

  const handleConfirm = async () => {
    setError('');
    setLoading(true);
    try {
      await confirmSignUp({
        username: auth.username,
        confirmationCode: auth.code,
      });

      const sub = userSubRef.current;
      if (!sub) throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ (sub) ได้');

      let imageUrl = form.profile_picture_url;

      if (profilePictureFile) {
        const formData = new FormData();
        formData.append('file', profilePictureFile);

        const res = await fetch('http://localhost:8000/upload/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('อัปโหลดรูปโปรไฟล์ไม่สำเร็จ');

        const { url } = await res.json();
        imageUrl = url;
      }

      await createStudent({
        id: sub,
        user_id: sub,
        student_code: form.student_code,
        full_name: form.full_name,
        faculty: form.faculty,
        major: form.major,
        year: Number(form.year),
        curriculum_id: form.curriculum_id || null,
        profile_picture_url: imageUrl,
        email: form.email,
        phone: form.phone,
        gender: form.gender as 'male' | 'female' | 'other',
        birth_date: form.birth_date,
        line_id: form.line_id,
        student_status: 'active',
        is_active: true,
      });

      alert('สมัครสำเร็จ');
      router.push('/auth/signin');
    } catch (err: any) {
      setError(err.message || 'ยืนยันไม่สำเร็จ');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] from-gray-100 to-blue-100 px-4 py-10">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg space-y-6">
        {/* Logo + Title */}
        <div className="text-center space-y-2">
          <img src="/logomain.svg" alt="Logo" className="mx-auto h-16 w-auto" />
          <h1 className="text-2xl font-bold text-gray-800">สมัครสมาชิกนักศึกษา</h1>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm rounded px-4 py-2 border border-red-300">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Input icon={<UserPlus />} name="student_code" placeholder="รหัสนักศึกษา" onChange={handleChange} />
            <Input icon={<BookOpen />} name="full_name" placeholder="ชื่อ-นามสกุล" onChange={handleChange} />
            <Input icon={<ShieldCheck />} name="faculty" placeholder="คณะ" onChange={handleChange} />
            <Input icon={<BookOpen />} name="major" placeholder="สาขา" onChange={handleChange} />
            <Input icon={<Calendar />} name="year" type="number" placeholder="ปีการศึกษา" onChange={handleChange} />
            <Select name="curriculum_id" onChange={handleChange} options={curricula.map((c) => ({ label: c.name, value: c.id }))} />
            <Input icon={<Phone />} name="phone" placeholder="เบอร์โทรศัพท์" onChange={handleChange} />
            <Input icon={<Mail />} name="email" placeholder="อีเมล" onChange={handleChange} />
            <Input icon={<UserPlus />} name="line_id" placeholder="LINE ID" onChange={handleChange} />
            <Input icon={<Calendar />} name="birth_date" type="date" onChange={handleChange} />
            <Select name="gender" onChange={handleChange} options={[
              { label: 'ชาย', value: 'male' },
              { label: 'หญิง', value: 'female' },
              { label: 'อื่น ๆ', value: 'other' },
            ]} />
            <Input icon={<Upload />} type="file" accept="image/*" onChange={handleFileChange} />

<button
  disabled={loading}
  onClick={handleNext}
  className="w-full bg-blue-600 text-white font-semibold py-3 text-base rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-60"
>
  <ArrowRight className="w-5 h-5" />
  ดำเนินการสมัคร (ถัดไป)
</button>
<div className="text-center text-sm text-gray-600 pt-2">
  มีบัญชีอยู่แล้วใช่ไหม?{' '}
  <span
    onClick={() => router.push('/auth/signin')}
    className="text-blue-600 font-medium hover:underline cursor-pointer"
  >
    เข้าสู่ระบบ
  </span>
</div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Input icon={<UserPlus />} name="username" placeholder="Username" onChange={handleAuthChange} />
            <Input icon={<Lock />} name="password" type="password" placeholder="Password" onChange={handleAuthChange} />
<button
  disabled={loading}
  onClick={handleSignUp}
  className="w-full bg-blue-600 text-white font-semibold py-3 text-base rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-60"
>
  {loading ? (
    <>
      <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span>กำลังสมัคร...</span>
    </>
  ) : (
    <>
      <ArrowRight className="w-5 h-5" />
      <span>สมัครสมาชิก</span>
    </>
  )}
</button>

            <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:underline flex items-center gap-1 justify-center mt-2">
              <ArrowLeft className="w-4 h-4" /> กลับ
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Input icon={<ShieldCheck />} name="code" placeholder="กรอกรหัสยืนยันจากอีเมล" onChange={handleAuthChange} />
            <button disabled={loading} onClick={handleConfirm} className="btn-success w-full flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              ยืนยันอีเมลและสมัครสมาชิก
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ helper components ------------------------------ */
function Input({
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }) {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
      {icon && <span className="mr-2 text-gray-400">{icon}</span>}
      <input {...props} className="w-full text-sm bg-transparent focus:outline-none" />
    </div>
  );
}

function Select({
  name,
  onChange,
  options,
}: {
  name: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: { label: string; value: string }[];
}) {
  return (
    <select
      name={name}
      onChange={onChange}
      className="w-full text-sm bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="">— กรุณาเลือก —</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
