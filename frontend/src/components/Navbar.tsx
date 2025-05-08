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
  const [userId, setUserId] = useState<string | null>(null);
  const pathname = usePathname();
  const isActive = useIsActive(pathname);

  const [role, setRole] = useState<'student' | 'professor' | 'staff' | null>(null);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const session = await fetchAuthSession();
        const rawGroups = session.tokens?.idToken?.payload['cognito:groups'];
        const token = session.tokens?.idToken?.payload;
        const sub = token?.sub;
        if (sub) {
          setUserId(sub);
        }
        let roleFromGroup: string | undefined = undefined;
        
        if (Array.isArray(rawGroups) && typeof rawGroups[0] === 'string') {
          roleFromGroup = rawGroups[0]; // ✅ ปลอดภัยแล้ว
        } else if (typeof rawGroups === 'string') {
          roleFromGroup = rawGroups;
        }
        
  
        if (roleFromGroup && ['student', 'professor', 'staff'].includes(roleFromGroup)) {
          setRole(roleFromGroup as 'student' | 'professor' | 'staff');
        } else {
          setRole(null); // ถ้าไม่มี role ที่ต้องการ
        }
      } catch (err) {
        console.warn('ไม่พบ session หรือยังไม่ได้ login:', err);
        setRole(null);
      }
    };
  
    loadRole();
  }, []);
  

  // กำหนดเมนูตาม role
  const menu: { href: string; label: string }[] = [
    { href: '/', label: 'หน้าหลัก' },
    ...(role === 'student'
      ? [
          { href: `/student/profile/${userId}`, label: 'โปรไฟล์ของฉัน' },
          { href: '/student/activityenroll', label: 'ลงทะเบียนกิจกรรม' },
        ]
      : role === 'professor'
      ? [{ href: '/professor/dashboard', label: 'สรุปนักศึกษา' }]
      : role === 'staff'
      ? [
          { href: '/staff/activities', label: 'จัดการกิจกรรม' },
        ]
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
        <NavbarCollapse className="gap-6">
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
        </NavbarCollapse>
      </Navbar>
    </>
  );
}
