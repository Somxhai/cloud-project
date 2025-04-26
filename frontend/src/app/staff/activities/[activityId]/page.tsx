"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface StudentActivity {
  activity_id: number;
  user_id: number;
  join_date: string;
  status: string; // "pending", "approved", "denied"
}

interface UserInfo {
  user_id: number;
  name: string;
  role: string;
  username: string;
  password: string;
}

interface Participant {
  user_id: number;
  student_id: string; // เพิ่มเข้ามา
  name: string;
  join_date: string; // เพิ่มเข้ามา
  status: string;
}

export default function ActivityParticipantsPage() {
  const { activityId } = useParams();
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      const studentActivityRes = await fetch("/student_activity.json");
      const userInfoRes = await fetch("/user_info.json");

      const studentActivityData: StudentActivity[] =
        await studentActivityRes.json();
      const userInfoData: UserInfo[] = await userInfoRes.json();

      // หา user_id ที่ join กิจกรรมนี้
      const joinedUsers = studentActivityData.filter(
        (sa) => sa.activity_id === Number(activityId)
      );

      const participantsData: Participant[] = joinedUsers.map((joinedUser) => {
        const userInfo = userInfoData.find(
          (user) => user.user_id === joinedUser.user_id
        );
        return {
          user_id: joinedUser.user_id,
          student_id: "",
          name: userInfo ? userInfo.name : "ไม่พบชื่อ",
          join_date: joinedUser.join_date,
          status: joinedUser.status,
        };
      });

      setParticipants(participantsData);
    };

    fetchParticipants();
  }, [activityId]);

  return (
    <div className="min-h-screen px-6 py-10 sm:px-16 bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">
          รายชื่อผู้เข้าร่วมกิจกรรม
        </h1>
        <Link
          href="/staff/activities"
          className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 shadow-md hover:shadow-lg"
        >
          กลับไปหน้ากิจกรรม
        </Link>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-[#1a1a1a] rounded-xl shadow-md p-4">
        <h2 className="text-xl font-semibold text-center mb-4">
          รายชื่อผู้เข้าร่วมกิจกรรม
        </h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-[#222] text-left">
              <th className="p-3 font-semibold">User ID</th>
              <th className="p-3 font-semibold">รหัสนักศึกษา</th>
              <th className="p-3 font-semibold">ชื่อ-นามสกุล</th>
              <th className="p-3 font-semibold">วันที่เข้าร่วม</th>
              <th className="p-3 font-semibold">สถานะ</th>
              <th className="p-3 font-semibold text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {participants.length > 0 ? (
              participants.map((participant) => (
                <tr
                  key={participant.user_id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"
                >
                  <td className="p-3">{participant.user_id}</td>
                  <td className="p-3">{participant.student_id || "-"}</td>{" "}
                  {/* ยังไม่มีข้อมูล */}
                  <td className="p-3">{participant.name}</td>
                  <td className="p-3">{participant.join_date}</td>
                  <td className="p-3 capitalize">{participant.status}</td>
                  <td className="p-3 text-center flex gap-2 justify-center">
                    <button className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded">
                      Approve
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded">
                      Deny
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-6">
                  ไม่มีผู้เข้าร่วมในกิจกรรมนี้
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
