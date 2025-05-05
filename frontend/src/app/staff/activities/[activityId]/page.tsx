'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { StudentActivityWithStudentInfo } from '@/types/models';
import { getParticipantsByActivityId } from '@/lib/activity';
import { updateStudentActivityStatus } from '@/lib/student';

export default function ActivityParticipantsPage() {
  const { activityId } = useParams();
  const [participants, setParticipants] = useState<StudentActivityWithStudentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipants = async () => {
    if (!activityId || typeof activityId !== 'string') return;
    try {
      const data = await getParticipantsByActivityId(activityId);
      setParticipants(data);
    } catch (err) {
      console.error('Error fetching participants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [activityId]);

  const handleStatusChange = async (studentId: string, newStatus: number) => {
    try {
      await updateStudentActivityStatus(activityId as string, studentId, newStatus);
      fetchParticipants(); // Refresh
    } catch (err) {
      console.error('Error updating status:', err);
      alert('ไม่สามารถอัปเดตสถานะได้');
    }
  };

  const statusText = {
    0: 'รอยืนยัน',
    1: 'อนุมัติแล้ว',
    2: 'ไม่อนุมัติ',
    3: 'เสร็จสิ้น',
  };

  return (
    <div className="min-h-screen px-6 py-10 sm:px-16 bg-gray-50 text-gray-900">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">รายชื่อผู้เข้าร่วมกิจกรรม</h1>
        <Link
          href="/staff/activities"
          className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg text-sm font-medium"
        >
          กลับไปหน้ากิจกรรม
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">ข้อมูลผู้เข้าร่วม</h2>

        {loading ? (
          <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
        ) : (
          <table className="w-full table-auto text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">รหัสนักศึกษา</th>
                <th className="p-3">ชื่อ - สกุล</th>
                <th className="p-3">วันที่เข้าร่วม</th>
                <th className="p-3">สถานะ</th>
                <th className="p-3 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {participants.length > 0 ? (
                participants.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{p.student_code || '-'}</td>
                    <td className="p-3">{p.full_name}</td>
                    <td className="p-3">{p.participated_at?.slice(0, 10)}</td>
                    <td className="p-3">{statusText[p.status]}</td>
                    <td className="p-3 text-center">
                      {p.status === 0 && (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleStatusChange(p.student_id, 1)}
                            className="text-green-600 hover:underline"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(p.student_id, 2)}
                            className="text-red-600 hover:underline"
                          >
                            Deny
                          </button>
                        </div>
                      )}
                      {p.status === 1 && (
                        <button
                          onClick={() => handleStatusChange(p.student_id, 3)}
                          className="text-blue-600 hover:underline"
                        >
                          Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    ไม่มีข้อมูลผู้เข้าร่วมกิจกรรม
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
