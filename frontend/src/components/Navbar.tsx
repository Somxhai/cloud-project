'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Navbar,
  NavbarBrand,
  NavbarToggle,
  NavbarCollapse,
  NavbarLink,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { fetchAuthSession } from '@aws-amplify/auth';
import '@/lib/amplifyConfig';
import {
  ActivitySquare,
  BookOpenCheck,
  Users,
  ClipboardList,
  UserCircle,
  PencilRuler,
  GraduationCap,
  LayoutDashboard,
} from 'lucide-react';
import React from 'react';

/* -------------------------- เช็ก active path -------------------------- */
const useIsActive = (pathname: string) => (href: string) => {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
};

export default function MainNavbar() {
  const pathname = usePathname();
  const isActive = useIsActive(pathname);

  const [userId, setUserId] = useState<string | null>(null);
  let [role, setRole] = useState<'student' | 'professor' | 'staff' | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false); // ✅ เพื่อเช็คว่าโหลดเสร็จ

  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.payload;

        console.log('Session token payload:', token);

        const sub = token?.sub;
        const displayName = token?.['cognito:username'];
        const rawGroups = token?.['cognito:groups'];

        if (sub) setUserId(sub);
        if (typeof displayName === 'string') setName(displayName);

        let roleFromGroup: string | undefined = undefined;
        if (Array.isArray(rawGroups) && typeof rawGroups[0] === 'string') {
          roleFromGroup = rawGroups[0];
        } else if (typeof rawGroups === 'string') {
          roleFromGroup = rawGroups;
        }

        if (roleFromGroup && ['student', 'professor', 'staff'].includes(roleFromGroup)) {
          setRole(roleFromGroup as 'student' | 'professor' | 'staff');
        } else {
          setRole(null);
        }

        //setRole('staff'); // ✅ สำหรับทดสอบ


      } catch (err) {
        console.warn('ไม่พบ session หรือยังไม่ได้ login:', err);
        setRole(null);
      } finally {
        setIsLoaded(true); // ✅ โหลดเสร็จ
      }
    };

    loadSessionData();
  }, []);
  const nameA = 'ดร.สมพร สอนดี';
  const roleA = 'อาจารย์';
  
  // กำหนดเมนูตาม role
const menu: { href: string; label: string; icon: React.ReactNode }[] = [
  ...(role === 'student'
    ? [
        {
          href: `/student/profile/${userId}`,
          label: 'โปรไฟล์ของฉัน',
          icon: <UserCircle className="w-4 h-4" />,
        },
        {
          href: '/student/activityenroll',
          label: 'ลงทะเบียนกิจกรรม',
          icon: <PencilRuler className="w-4 h-4" />,
        },
        {
          href: '/student/myactivities',
          label: 'กิจกรรมของฉัน',
          icon: <GraduationCap className="w-4 h-4" />,
        },
      ]
    : role === 'professor'
    ? [
        {
          href: '/professor/dashboard',
          label: 'สรุปนักศึกษา',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
      ]
    : role === 'staff'
    ? [
        {
          href: '/staff/activity',
          label: 'จัดการกิจกรรม',
          icon: <ActivitySquare className="w-4 h-4" />,
        },
        {
          href: '/staff/skill',
          label: 'จัดการทักษะ',
          icon: <ClipboardList className="w-4 h-4" />,
        },
        {
          href: '/staff/curriculum',
          label: 'จัดการหลักสูตร',
          icon: <BookOpenCheck className="w-4 h-4" />,
        },
        {
          href: '/staff/professorstudents',
          label: 'จัดการนักศึกษาและที่ปรึกษา',
          icon: <Users className="w-4 h-4" />,
        },
      ]
    : []),
];


/*
  const activeCls =
    '!bg-[#ef4653] !text-white !px-4 !py-2 !rounded-xl !font-semibold hover:!bg-[#e03847] transition-colors';
  const normalCls =
    '!text-sm !font-medium !text-gray-900 hover:!text-[#ef4653] transition-colors';
*/

    const activeCls =
  'px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#ef4653] hover:bg-[#e03847] transition-colors';
const normalCls =
  'text-sm font-medium text-gray-900 hover:text-[#ef4653] transition-colors';


 return (
    <>
      <div className="w-full fixed top-0 z-50 flex justify-center py-4">
        <div className="w-full max-w-7xl bg-white shadow-md rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* โลโก้ */}
          <Link href="/" className="flex items-center">
            <Image src="/logomain.svg" alt="logo" width={144} height={38} priority />
          </Link>

          {/* เมนูกลาง */}
          <div className="flex items-center gap-6">
{menu.map(({ href, label, icon }, index) => {
  const active = isActive(href);
  const isLast = index === menu.length - 1;

  return (
    <div key={href} className="flex items-center gap-2">
      <Link href={href} className={active ? activeCls : normalCls}>
        <div className="flex items-center gap-2">
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<any>, {
                className: `w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-[#ef4653]'}`,
              })
            : icon}
          <span>{label}</span>
        </div>
      </Link>

      {/* | คั่นอยู่ข้างนอก Link */}
      {!isLast && <div className="text-gray-300 px-1">|</div>}
    </div>
  );
})}


            <div className="text-gray-300">|</div>
            <Link
              href="/auth/profile"
              className="flex flex-col text-right text-sm leading-tight hover:underline"
            >
              <span className="font-semibold text-gray-900">{name}</span>
              <span className="text-gray-500">{role}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}



