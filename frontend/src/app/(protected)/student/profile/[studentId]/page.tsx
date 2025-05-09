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
  function parseSkills(skills: string[]): { name: string; count: number }[] {
    return skills.map(skill => {
      const [rawName, rawCount] = skill.split(':');
      const name = rawName.trim();
      const count = parseInt(rawCount?.trim() || '0', 10);
      return { name, count };
    });
  }

  
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
  const parsedSoftSkills = parseSkills(student.Skill_S);
  const parsedHardSkills = parseSkills(student.Skill_H);
  
  return (
    <div className="min-h-screen font-sans bg-gray-50 px-6 py-10 sm:px-10 md:px-20 lg:px-32">
      <h1 className="text-4xl font-bold text-left">โปรไฟล์</h1>

{/* Student Info */}
<section className="mt-10 space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    {/* ข้อมูลส่วนตัว */}
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-4">ข้อมูลส่วนตัว</h2>
      <div className="space-y-1 text-sm text-gray-800">
        <p><b>ชื่อ-นามสกุล:</b> {student.full_name}</p>
        <p><b>รหัสนักศึกษา:</b> {student.student_code}</p>
        <p><b>อาจารย์ที่ปรึกษา:</b> {student.professor_name}</p>
        <p><b>สาขาวิชา:</b> {student.major}</p>
        <p><b>คณะ:</b> {student.faculty}</p>
      </div>
    </div>

    {/* ทักษะ */}
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-4">ทักษะที่มี</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


        {/* Soft Skills */}
        <div>
          <h3 className="text-base font-semibold text-gray-700">Soft Skills</h3>
          <p className="text-sm text-gray-500 mb-2">ทักษะทางอารมณ์และสังคม</p>
          <ul className="space-y-1 text-sm text-gray-700">
          {parsedSoftSkills.map((s, idx) => (
            <li key={idx} className="flex justify-between items-center">
              <span>{s.name}</span>
              <span className="bg-gray-300 text-xs px-2 py-0.5 rounded-full">{s.count}</span>
            </li>
          ))}

          </ul>
        </div>
          
        {/* Hard Skills */}
        <div className="sm:border-l sm:border-gray-300 sm:pl-6">
          <h3 className="text-base font-semibold text-gray-700">Hard Skills</h3>
          <p className="text-sm text-gray-500 mb-2">ทักษะทางเทคนิค</p>
          <ul className="space-y-1 text-sm text-gray-700">
          {parsedHardSkills.map((s, idx) => (
            <li key={idx} className="flex justify-between items-center">
              <span>{s.name}</span>
              <span className="bg-gray-300 text-xs px-2 py-0.5 rounded-full">{s.count}</span>
            </li>
          ))}
          </ul>
        </div>

      </div>
    </div>

  </div>
</section>




{/* Activity Cards */}
<section className="space-y-6 mt-12">
  <h2 className="text-2xl font-semibold text-gray-800">กิจกรรมที่เคยเข้าร่วม</h2>
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
  {currentItems.map((activity) => (
    <div
      key={activity.id}
      className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100"
    >
      {/* รูปภาพ 16:9 */}
      <div className="relative w-full aspect-[16/9] bg-gray-100">
        <Image
          src="/data-science-and-visualization-with-python.jpg"
          alt={activity.name}
          fill
          className="object-cover"
        />
      </div>

      {/* ข้อมูลกิจกรรม */}
      <div className="p-4 space-y-2">
        <h3 className="text-base font-semibold text-gray-800">{activity.name}</h3>
        <p className="text-sm text-gray-600">วัน-เวลาที่เข้าร่วม: {formatDateThai(activity.event_date)}</p>
        <p className="text-sm font-medium text-gray-700">ทักษะที่ได้รับ:</p>
        <ul className="flex flex-wrap gap-2 mt-1">
          {activity.skills.map((s: string, idx: number) => {
            return (
              <li
                key={idx}
                className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-md font-medium"
              >
                {s}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  ))}
</div>


  {/* Pagination */}
  {totalPages > 1 && (
    <div className="flex justify-center mt-6 space-x-2">
      {Array.from({ length: totalPages }).map((_, idx) => {
        const page = idx + 1;
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-1.5 text-sm rounded-full transition ${
              currentPage === page
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
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
