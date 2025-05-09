export type UserRole = 'student' | 'professor' | 'staff';

export type NavItem = { href: string; label: string };

export const navLinks: Record<UserRole, NavItem[]> = {
  student: [
    { href: '/', label: 'หน้าหลัก' },
    { href: '/me/activities', label: 'กิจกรรมของฉัน' },
    { href: '/registration', label: 'ลงทะเบียนกิจกรรม' },
  ],
  professor: [
    { href: '/', label: 'หน้าหลัก' },
    { href: '/professor/dashboard', label: 'สรุปนักศึกษา' },
  ],
  staff: [
    { href: '/', label: 'หน้าหลัก' },
    { href: '/staff/activity/new', label: 'เพิ่ม/แก้ไขกิจกรรม' },
    { href: '/staff/activities', label: 'จัดการกิจกรรม' },
  ],
};
