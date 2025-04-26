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

/* ------------------------- 1) mock role (แก้ภายหลัง) ------------------------- */
function getCurrentRole(): 'student' | 'professor' | 'staff' {
  // TODO: ดึงจาก auth/session
  return 'professor';           // เปลี่ยนค่าเพื่อทดสอบ
}
/* ----------------------------------------------------------------------------- */

/* -------------------------- 2) util เช็ก active ------------------------------ */
const useIsActive = (pathname: string) => (href: string) => {
  if (href === '/') return pathname === '/';        // เฉพาะ root เท่านั้น
  return pathname.startsWith(href);
};
/* ----------------------------------------------------------------------------- */

export default function MainNavbar() {
  const pathname = usePathname();
  const isActive = useIsActive(pathname);
  const role = getCurrentRole();

  /* ---------------------- 3) menu list ตาม role ------------------------------ */
  const menu: { href: string; label: string }[] = [
    { href: '/', label: 'หน้าหลัก' },
    ...(role === 'student'
      ? [
          { href: '/me/activities', label: 'กิจกรรมของฉัน' },
          { href: '/registration', label: 'ลงทะเบียนกิจกรรม' },
        ]
      : role === 'professor'
      ? [{ href: '/professor/dashboard', label: 'สรุปนักศึกษา' }]
      : [
          { href: '/staff/activity/new', label: 'เพิ่ม/แก้ไขกิจกรรม' },
          { href: '/staff/activities', label: 'จัดการกิจกรรม' },
        ]),
  ];
  /* --------------------------------------------------------------------------- */

  /* ------------------ 4) class ของปุ่ม active / ปกติ ------------------------- */
  const activeCls =
    '!px-4 !py-1.5 !rounded-2xl !font-medium !bg-[#ef4653] !text-white !hover:bg-[#e03847] !transition-colors';
  const normalCls =
    '!px-4 !py-1.5 !font-medium !text-gray-900 !hover:text-[#ef4653] !transition-colors';
  /* --------------------------------------------------------------------------- */

  return (
    <>
      {/* bar สีแดงด้านบนเต็มจอ */}
      <div className="w-full h-[6px] bg-[#ef4653]" />

      <Navbar fluid rounded={false} className="border-b border-gray-200 bg-white">
        {/* logo / brand */}
        <NavbarBrand as={Link} href="/">
          <Image src="/logomain.png" alt="logo" width={120} height={32} priority />
        </NavbarBrand>

        <NavbarToggle />

        {/* ลิงก์เมนู */}
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
