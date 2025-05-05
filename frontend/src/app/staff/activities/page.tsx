'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllActivitiesWithSkills } from '@/lib/activity';
import { ActivityWithSkills } from '@/types/models';
import { formatDateThai } from '@/lib/utils/date';


export default function StaffActivitiesPage() {
  const [activityList, setActivityList] = useState<ActivityWithSkills[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true); // ✅ เพิ่มสถานะ loading

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getAllActivitiesWithSkills();
        setActivityList(data);
      } catch (err) {
        console.error('Failed to load activities:', err);
      } finally {
        setLoading(false); // ✅ ตั้ง loading เป็น false หลังโหลดเสร็จ
      }
    };

    fetchActivities();
  }, []);

  const filtered = activityList.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen px-6 py-10 sm:px-16 bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">หน้าจัดการกิจกรรม</h1>
        <Link
          href="/staff/activity/new"
          className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          เพิ่มกิจกรรม
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="ค้นหากิจกรรม..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-[300px] px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-x-auto bg-white dark:bg-[#1a1a1a] rounded-xl shadow-md p-4">
        <h2 className="text-xl font-semibold text-center mb-4">กิจกรรมทั้งหมด</h2>

        {loading ? (
          <div className="text-center py-6 text-gray-500">กำลังโหลด...</div> // ✅ แสดงข้อความระหว่างโหลด
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-[#222] text-left">
                <th className="p-3 font-semibold">ชื่อกิจกรรม</th>
                <th className="p-3 font-semibold">วันกิจกรรม</th>
                <th className="p-3 font-semibold">สถานะ</th>
                <th className="p-3 font-semibold">รายละเอียด</th>
                <th className="p-3 font-semibold text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((activity) => (
                  <tr
                    key={activity.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"
                  >
                    <td className="p-3">{activity.name}</td>
                    <td className="p-3">{formatDateThai(activity.event_date)}</td>
                    <td className="p-3">
                      {{
                        0: 'เปิดรับ',
                        1: 'ปิดรับ',
                        2: 'ยกเลิก',
                      }[activity.status]}
                    </td>
                    <td className="p-3">{activity.description}</td>
                    <td className="p-3 text-center flex justify-center gap-4">
                      <Link
                        href={`/staff/activity/edit/${activity.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        แก้ไข
                      </Link>
                      <button className="text-red-600 dark:text-red-400 hover:underline">
                        ลบ
                      </button>
                      <Link
                        href={`/staff/activities/${activity.id}`}
                        className="text-green-600 dark:text-green-400 hover:underline"
                      >
                        ดูรายชื่อผู้เข้าร่วม
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-6">
                    ไม่พบกิจกรรม
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
