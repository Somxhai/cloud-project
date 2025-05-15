'use client';

import './globals.css';
import { Noto_Sans_Thai } from 'next/font/google';
import MainNavbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';
import '@/lib/amplifyConfig';

/* ---------- โหลดฟอนต์ Google ---------- */
const notoThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-thai',
});

/* ---------- ตัว Layout ---------- */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // ระบุ path ที่ไม่ต้องการแสดง Navbar
const hideNavbarRoutes = [
  '/', // ซ่อน Navbar เฉพาะหน้าแรก
  '/auth/signin',
  '/auth/signup',
  '/auth/confirm',
  '/auth/force-signout',
  '/auth/professor-signup',
  '/auth/staff-signup',
  '/auth/student-signup',
];

const shouldShowNavbar = !hideNavbarRoutes.some((route) =>
  pathname === route || pathname.startsWith(route + '/')
);


  return (
    <html lang="th" className={`${notoThai.variable} bg-[#f5f5f5] min-h-screen`} >
      <body className="font-sans antialiased bg-[#f5f5f5] text-gray-800">
        {/* แสดง Navbar เฉพาะบางหน้า */}
        {shouldShowNavbar && <MainNavbar />}

        {/* เนื้อหาเพจพร้อม padding ด้านบน */}
        <div className={shouldShowNavbar ? 'pt-[100px] bg-[#f5f5f5]' : ''}>
          {children}
        </div>
      </body>
    </html>
  );
}
