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

/* -------------------------- เช็ก active path -------------------------- */
const useIsActive = (pathname: string) => (href: string) => {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
};

export default function MainNavbar() {
  const pathname = usePathname();
  const isActive = useIsActive(pathname);

  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<'student' | 'professor' | 'staff' | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false); // ✅ เพื่อเช็คว่าโหลดเสร็จ

  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.payload;

        console.log('Session token payload:', token);

        const sub = token?.sub;
        const displayName = token?.name;
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
      } catch (err) {
        console.warn('ไม่พบ session หรือยังไม่ได้ login:', err);
        setRole(null);
      } finally {
        setIsLoaded(true); // ✅ โหลดเสร็จ
      }
    };

    loadSessionData();
  }, []);

  // กำหนดเมนูตาม role
  const menu: { href: string; label: string }[] = [
    //{ href: '/', label: 'หน้าหลัก' },
    ...(role === 'student'
      ? [
          { href: `/student/profile/${userId}`, label: 'โปรไฟล์ของฉัน' },
          { href: '/student/activityenroll', label: 'ลงทะเบียนกิจกรรม' },
        ]
      : role === 'professor'
      ? [{ href: '/professor/dashboard', label: 'สรุปนักศึกษา' }]
      : role === 'staff'
      ? [{ href: '/staff/activities', label: 'จัดการกิจกรรม' }
        , { href: '/staff/professorstudents', label: 'จัดการนักศึกษา' }]
      
      : []),
  ];

  const activeCls =
    '!px-4 !py-1.5 !rounded-2xl !font-medium !bg-[#ef4653] !text-white !hover:bg-[#e03847] !transition-colors';
  const normalCls =
    '!px-4 !py-1.5 !font-medium !text-gray-900 !hover:text-[#ef4653] !transition-colors';

  return (
    <>
      <div className="w-full h-[16px] bg-[#ef4653]" />
      <Navbar fluid rounded={false} className="border-b border-gray-200 bg-white">
        <NavbarBrand as={Link} href="/">
          <Image src="/logomain.png" alt="logo" width={120} height={32} priority />
        </NavbarBrand>
        <NavbarToggle />
        <NavbarCollapse className="gap-6 items-center justify-between">
          <div className="flex gap-6 items-center">
            {menu.map(({ href, label }) => (
              <NavbarLink
                key={href}
                as={Link}
                href={href}
                className={isActive(href) ? activeCls : normalCls}
              >
                {label}
              </NavbarLink>
            ))}
          <div>|</div>
            {/* ✅ แถบโปรไฟล์จะถูกแสดงเมื่อโหลดเสร็จและมีชื่อกับ role */}
              <Link
                href="/auth/profile"
                className="flex flex-col text-right text-sm leading-tight hover:underline"
              >
                <span className="font-semibold text-gray-900">{name}</span>
                <span className="text-gray-500 capitalize">{role}</span>
              </Link>
            
          </div>
        </NavbarCollapse>
      </Navbar>
    </>
  );
}
