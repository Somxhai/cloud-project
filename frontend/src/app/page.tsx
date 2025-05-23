'use client';

import Image from 'next/image';
import { BadgeCheck, Users, ArrowRightCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] from-white to-blue-50 flex flex-col items-center justify-center px-6 py-12 text-gray-800">
      {/* Logo + Title */}
      <div className="text-center mb-12">
        <Image
          src="/logomain.svg"
          alt="ANTivity Logo"
          width={500}
          height={500}
          className="mx-auto mb-4"
          priority
        />
        <h1 className="text-4xl font-extrabold tracking-tight text-blue-700">
          ANTivity Skills Tracker
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          ระบบวิเคราะห์และติดตามทักษะนักศึกษาผ่านกิจกรรม
        </p>
      </div>

      {/* Description */}
      <div className="max-w-3xl bg-white p-6 rounded-xl shadow-md space-y-4 text-base leading-relaxed border border-gray-200">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-lg">
          <BadgeCheck className="w-5 h-5" />
          ที่มาและความสำคัญของระบบ
        </div>
        <p>
          จากปัญหาการเก็บข้อมูลการเข้าร่วมกิจกรรมและการวิเคราะห์ทักษะของนักศึกษาที่แยกกระจัดกระจาย
          ทำให้ยากต่อการวิเคราะห์ภาพรวมของทักษะที่นักศึกษาได้รับและขาดแคลน
          ระบบ <strong>ANTivity Skills Tracker</strong> ถูกออกแบบมาเพื่อรวบรวมข้อมูลกิจกรรมจากทุกหน่วยงาน
          พร้อมวิเคราะห์ทักษะ Soft Skills และ Hard Skills
          เพื่อติดตามพัฒนาการของนักศึกษา ช่วยให้นักศึกษา อาจารย์ที่ปรึกษา
          และฝ่ายกิจกรรมสามารถเห็นภาพรวมได้อย่างมีประสิทธิภาพ
        </p>
      </div>

      {/* Members */}
      <div className="mt-12 w-full max-w-3xl bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div className="flex items-center gap-2 text-green-600 font-semibold text-lg mb-4">
          <Users className="w-5 h-5" />
          สมาชิกกลุ่ม
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-gray-700">
          <li>ฉัทปนัย เกิดสมจิตร์ — <span className="text-gray-500">6609611808</span></li>
          <li>ชนกันต์ ทองรอง — <span className="text-gray-500">6609611816</span></li>
          <li>ณัฐชนน สาระสังข์ — <span className="text-gray-500">6609611907</span></li>
          <li>ณัฐดนัย พันธุเสนา — <span className="text-gray-500">6609611915</span></li>
          <li>ธนภูมิ พลเมืองดี — <span className="text-gray-500">6609611972</span></li>
          <li>ธนัช เกิดทิพย์ — <span className="text-gray-500">6609611980</span></li>
          <li>ภัทรภูมิ กิ่งชัย — <span className="text-gray-500">6609612160</span></li>
          <li>สุภนัย จิรกาลกุล — <span className="text-gray-500">6609612269</span></li>
        </ul>
      </div>

      {/* CTA / Navigation */}
      <div className="mt-8">
        <a
          href="/auth/signin"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition text-sm font-medium"
        >
          <ArrowRightCircle className="w-4 h-4" />
          ไปยังหน้าเข้าสู่ระบบ
        </a>
      </div>
    </div>
  );
}
