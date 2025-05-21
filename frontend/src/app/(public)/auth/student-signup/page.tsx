// src/app/auth/studentsignup/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signUp, confirmSignUp, signIn,fetchAuthSession ,signOut} from '@aws-amplify/auth';
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
import {deleteCognitoUser} from '@/lib/user';
import { getAuthHeaders } from '@/lib/utils/auth';

export default function StudentSignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const userSubRef = useRef<string | null>(null);
  const [studentCodeValid, setStudentCodeValid] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
   const [confirmed, setConfirmed] = useState(false);
  const [auth, setAuth] = useState({
    username: '',
    password: '',
    code: '',
  });

  useEffect(() => {
    getAllCurricula().then(setCurricula);
  }, []);

    useEffect(() => {
    const handleBeforeUnload = async () => {
      if (!confirmed && auth.username) {
        try {
          await deleteCognitoUser(auth.username);
          console.log('ลบผู้ใช้จาก Cognito เรียบร้อยแล้ว');
        } catch (err) {
          console.error('ลบผู้ใช้ล้มเหลว', err);
        }
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [auth.username, confirmed]);

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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'student_code' && /^\d{10}$/.test(value)) {
      const exists = await checkStudentCodeExists(value);
      setStudentCodeValid(!exists);
    }

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

const isStep1Valid = () => {
  return (
    /^\d{10}$/.test(form.student_code) &&
    form.full_name.trim() !== '' &&
    form.faculty.trim() !== '' &&
    form.major.trim() !== '' &&
    form.year !== '' &&
    form.curriculum_id !== '' &&
    form.phone.trim() !== '' &&
    form.email.trim() !== '' &&
    form.line_id.trim() !== '' &&
    form.birth_date.trim() !== '' &&
    form.gender !== ''
  );
};

const handleNext = async () => {
  if (!isStep1Valid()) {
    setError('กรุณากรอกข้อมูลให้ครบถ้วน');
    return;
  }
  if (!studentCodeValid) {
    setError('รหัสนักศึกษานี้ถูกใช้แล้ว');
    return;
  }
  setError('');
  setStep(2);
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
  setStatusMessage('กำลังยืนยันอีเมล...');

  try {
    // ✅ 1. Confirm sign up
    await confirmSignUp({
      username: auth.username,
      confirmationCode: auth.code,
    });

    // ✅ 2. Sign in to get sub (userId)
    setStatusMessage('กำลังเข้าสู่ระบบ...');
    await signIn({ username: auth.username, password: auth.password });
    const session = await fetchAuthSession();
    const idTokenPayload = session.tokens?.idToken?.payload;
    const sub = idTokenPayload?.sub;

    if (!sub) throw new Error('ไม่สามารถดึง user sub จาก token ได้');

    // ✅ 3. Add to Cognito group
    setStatusMessage('กำลังเพิ่มเข้ากลุ่ม...');
    await fetch('http://localhost:8000/cognito/add-to-group', {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ username: auth.username, groupName: 'student' }),
    });

    // ✅ 4. Wait for sync to complete
    setStatusMessage('กำลังประมวลผล...');
    await new Promise((r) => setTimeout(r, 3000));

    // ✅ 5. Upload profile picture (if any)
    setStatusMessage('กำลังอัปโหลดรูปภาพ...');
    let imageUrl = form.profile_picture_url;
    if (profilePictureFile) {
      const formData = new FormData();
      formData.append('file', profilePictureFile);

      const res = await fetch('http://localhost:8000/upload/upload-image', {
        method: 'POST',
                headers: {
    Authorization: (await getAuthHeaders()).Authorization,
  },
        body: formData,
      });

      if (!res.ok) throw new Error('อัปโหลดรูปโปรไฟล์ไม่สำเร็จ');
      const { url } = await res.json();
      imageUrl = url;
    }

    // ✅ 6. Save to database
    setStatusMessage('กำลังบันทึกข้อมูลผู้ใช้...');
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
    setConfirmed(true);
    alert('สมัครสำเร็จ');
    await signOut();
    router.push('/auth/signin');
  } catch (err: any) {
    setError(err.message || 'ยืนยันไม่สำเร็จ');
  }

  setStatusMessage('');
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
            <label htmlFor="student_code" className="text-sm text-gray-600">รหัสนักศึกษา</label>
            <Input icon={<UserPlus />} name="student_code" placeholder="รหัสนักศึกษา" onChange={handleChange} />
            {!studentCodeValid && (
  <p className="text-sm text-red-500">รหัสนักศึกษานี้ถูกใช้แล้ว</p>
)}
            <label htmlFor="full_name" className="text-sm text-gray-600">ชื่อ-นามสกุล</label>  
            <Input icon={<BookOpen />} name="full_name" placeholder="ชื่อ-นามสกุล" onChange={handleChange} />
            <label htmlFor="faculty" className="text-sm text-gray-600">คณะ</label>
            <Input icon={<ShieldCheck />} name="faculty" placeholder="คณะ" onChange={handleChange} />
            <label htmlFor="major" className="text-sm text-gray-600">สาขา</label>
            <Input icon={<BookOpen />} name="major" placeholder="สาขา" onChange={handleChange} />
            <label htmlFor="year" className="text-sm text-gray-600">ชั้นปี</label>
            <Select
  name="year"
  value={form.year}
  onChange={handleChange}
  options={['1', '2', '3', '4'].map((y) => ({ label: `ชั้นปีที่ ${y}`, value: y }))}
/>
            <label htmlFor="curriculum_id" className="text-sm text-gray-600">หลักสูตร</label>
            <Select name="curriculum_id" onChange={handleChange} options={curricula.map((c) => ({ label: c.name, value: c.id }))} />
              <label htmlFor="birth_date" className="text-sm text-gray-600">เบอร์โทรศัพท์</label>
            <Input icon={<Phone />} name="phone" placeholder="เบอร์โทรศัพท์" onChange={handleChange} />
            <label htmlFor="birth_date" className="text-sm text-gray-600">อีเมล</label>
            <Input icon={<Mail />} name="email" placeholder="อีเมล" onChange={handleChange} />
            <label htmlFor="birth_date" className="text-sm text-gray-600">ไอดี ไลน์</label>
            <Input icon={<UserPlus />} name="line_id" placeholder="LINE ID" onChange={handleChange} />
            <label htmlFor="birth_date" className="text-sm text-gray-600">วันเกิด</label>
            <Input icon={<Calendar />} name="birth_date" type="date" onChange={handleChange} />
            <label htmlFor="birth_date" className="text-sm text-gray-600">เพศ</label>
            <Select name="gender" onChange={handleChange} options={[
              { label: 'ชาย', value: 'male' },
              { label: 'หญิง', value: 'female' },
              { label: 'อื่น ๆ', value: 'other' },
            ]} />
            <label htmlFor="birth_date" className="text-sm text-gray-600">รูปปก</label>
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
            {statusMessage && (
  <div className="text-sm text-gray-600 flex items-center gap-2 justify-center">
    <svg className="w-4 h-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
    <span>{statusMessage}</span>
  </div>
)}

<button
  disabled={loading}
  onClick={handleConfirm}
  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-white font-semibold transition 
    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:bg-green-800'}
  `}
>
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
  value,
  onChange,
  options,
}: {
  name: string;
  value?: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: { label: string; value: string }[];
}) {
  return (
    <select
      name={name}
      value={value}
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
