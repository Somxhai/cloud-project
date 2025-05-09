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
  const hideNavbarRoutes = ['/auth/signin', '/auth/signup', '/auth/confirm'];
  const shouldShowNavbar = !hideNavbarRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <html lang="th" className={notoThai.variable}>
      <body className="font-sans antialiased bg-gray-100 text-gray-800">
        {/* แสดง Navbar เฉพาะบางหน้า */}
        {shouldShowNavbar && <MainNavbar />}

        {/* เนื้อหาเพจ */}
        {children}
      </body>
    </html>
  );
}
