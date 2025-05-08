import './globals.css';
import { Noto_Sans_Thai } from 'next/font/google';
import MainNavbar from '@/components/Navbar';   // ← ใช้ไฟล์ที่คุณเพิ่งสร้าง
import { fetchAuthSession } from '@aws-amplify/auth';
import { redirect } from 'next/navigation';
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
  return (
    <html lang="th" className={notoThai.variable}>
      <body className="font-sans antialiased bg-gray-100 text-gray-800">
        {/* Navbar (แสดงทุกหน้า) */}
        <MainNavbar />

        {/* ช่องว่างกันทับ ถ้า Navbar ติด top-0 ในอนาคต */}
        {/* <div className="h-[60px]" /> */}

        {/* เนื้อหาเพจ */}
        {children}
      </body>
    </html>
  );
}
