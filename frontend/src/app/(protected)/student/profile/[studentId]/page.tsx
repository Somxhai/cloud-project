'use client';

import '@/lib/amplifyConfig';
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';
import { getStudentFullDetail, getCompletedActivitiesWithSkills } from "@/lib/student";
import { formatDateThai } from '@/lib/utils/date';


const ITEMS_PER_PAGE = 3;

export default function MyProfile() {
  const { studentId } = useParams();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [student, setStudent] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const verifyAccessAndFetch = async () => {
      try {
        await getCurrentUser();
        const session = await fetchAuthSession();
        const rawGroups = session.tokens?.idToken?.payload['cognito:groups'];
        console.log("👀 Token Payload:", session.tokens?.idToken?.payload);
        const groups = Array.isArray(rawGroups)
          ? rawGroups
          : typeof rawGroups === 'string'
            ? [rawGroups]
            : [];
        
        if (!groups.includes('student') && !groups.includes('professor')) {
          setUnauthorized(true);
          return;
        }
        

        if (!studentId || typeof studentId !== "string") return;

        const stu = await getStudentFullDetail(studentId);
        const acts = await getCompletedActivitiesWithSkills(studentId);
        setStudent(stu);
        setActivities(acts);
      } catch (err) {
        console.error("Auth error or fetch failed:", err);
        setUnauthorized(true);
      } finally {
        setLoading(false);
      }
    };

    verifyAccessAndFetch();
  }, [studentId]);

  if (loading) return <p className="p-6">กำลังโหลดข้อมูล...</p>;
  if (unauthorized) return <p className="p-6 text-red-600">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>;
  if (!student) return null;

  const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = activities.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen font-sans bg-gray-50 px-6 py-10 sm:px-10 md:px-20 lg:px-32">
      <h1 className="text-4xl font-bold text-center">My Profile</h1>

      {/* Student Info */}
      <section className="space-y-6 mt-10">
        <h2 className="text-2xl font-bold">Information</h2>
        <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col sm:flex-row">
          <div className="flex-1 p-6 border-b sm:border-b-0 sm:border-r">
            <h3 className="text-xl font-bold mb-4">Student Info</h3>
            <p><b>ชื่อ-นามสกุล:</b> {student.full_name}</p>
            <p><b>รหัสนักศึกษา:</b> {student.student_code}</p>
            <p><b>อาจารย์ที่ปรึกษา:</b> {student.professor_name}</p>
            <p><b>คณะ:</b> {student.faculty}</p>
			<p><b>สาขาวิชา:</b> {student.major}</p>
          </div>

          <div className="flex-1 p-6 border-b sm:border-b-0 sm:border-r">
            <h3 className="text-xl font-bold mb-4">Soft Skills</h3>
            <ul className="list-disc pl-4">
              {student.Skill_S.map((s: string, idx: number) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="flex-1 p-6">
            <h3 className="text-xl font-bold mb-4">Hard Skills</h3>
            <ul className="list-disc pl-4">
              {student.Skill_H.map((s: string, idx: number) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold">กิจกรรมที่เคยเข้าร่วม</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {currentItems.map((activity) => (
            <div key={activity.id} className="border rounded-xl p-4 bg-white shadow-sm">
              <h3 className="text-lg font-semibold">{activity.name}</h3>
              <p className="text-sm text-gray-600">วันที่: {formatDateThai(activity.event_date)}</p>
              <div className="relative w-full h-48 mt-2">
                <Image
                  src="/placeholder.png"
                  alt={activity.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-medium">ทักษะที่ได้รับ:</p>
                <ul className="flex flex-wrap gap-1 text-xs">
                  {activity.skills.map((s: string, idx: number) => (
                    <li
                      key={idx}
                      className="bg-gray-200 px-2 py-0.5 rounded-full"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-1 border rounded-full ${
                    currentPage === page
                      ? "bg-red-500 text-white"
                      : "bg-white border-red-500 text-red-500"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
