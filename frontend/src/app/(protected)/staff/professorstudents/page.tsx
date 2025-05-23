// File: src/app/staff/professor/student/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  getAllProfessors,
  getStudentsByProfessor,
  getUnassignedStudents,
  assignStudentToProfessor,
  removeStudentFromProfessor,
} from '@/lib/staffProfessor';
import { getStudentSkills, getStudentSkillLogs } from '@/lib/skill';
import type { Professor, Student, StudentSkill, StudentSkillLog } from '@/types/models';
import { formatDateThaiA } from '@/lib/utils/date';
import { BookOpen, BookText, Users } from 'lucide-react';

export default function ProfessorStudentManagementPage() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [unassignedStudents, setUnassignedStudents] = useState<Student[]>([]);
  const [selectedProfessorId, setSelectedProfessorId] = useState<string>('');
  const [selectedProfessorName, setSelectedProfessorName] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [currentSkills, setCurrentSkills] = useState<StudentSkill[]>([]);
  const [skillLogs, setSkillLogs] = useState<StudentSkillLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    getAllProfessors().then(setProfessors);
  }, []);

  const loadStudents = async (professorId: string) => {
    setLoading(true);
    try {
      const [assigned, unassigned] = await Promise.all([
        getStudentsByProfessor(professorId),
        getUnassignedStudents(),
      ]);
      setStudents(assigned);
      setUnassignedStudents(unassigned);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProfessor = (id: string, name: string) => {
    setSelectedProfessorId(id);
    setSelectedProfessorName(name);
    setSelectedStudent(null);
    loadStudents(id);
  };

  const handleAssign = async (studentId: string) => {
    await assignStudentToProfessor(selectedProfessorId, studentId);
    loadStudents(selectedProfessorId);
  };

  const handleRemove = async (studentId: string) => {
    await removeStudentFromProfessor(selectedProfessorId, studentId);
    loadStudents(selectedProfessorId);
  };

  const loadStudentSkills = async (studentId: string) => {
    setLoadingSkills(true);
    setLoadingLogs(true);
    try {
      const [skills, logs] = await Promise.all([
        getStudentSkills(studentId),
        getStudentSkillLogs(studentId),
      ]);
      setCurrentSkills(skills);
      setSkillLogs(logs);
    } finally {
      setLoadingSkills(false);
      setLoadingLogs(false);
    }
  };

  const handleSelectStudent = (stu: Student) => {
    setSelectedStudent(stu);
    if (stu.id) {
      loadStudentSkills(stu.id);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 sm:px-16 space-y-10 text-gray-900">
      <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
        <Users size={24} /> จัดการนักศึกษาในที่ปรึกษา
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* รายชื่ออาจารย์ */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-3">รายชื่ออาจารย์</h2>
          <ul className="space-y-1 text-sm">
            {professors.map((p) => (
              <li
                key={p.id}
                className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                  p.id === selectedProfessorId ? 'bg-blue-100 font-semibold' : ''
                }`}
                onClick={() => handleSelectProfessor(p.id!, p.full_name ?? 'ไม่ระบุชื่อ')}
              >
                {p.full_name}
              </li>
            ))}
          </ul>
        </div>

        {/* รายชื่อนักศึกษา */}
        <div className="md:col-span-2 bg-white rounded shadow p-4">
          {selectedProfessorId ? (
            <>
              <h2 className="text-lg font-semibold mb-4">
                นักศึกษาของ {selectedProfessorName}
              </h2>

              {loading ? (
                <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto text-sm mb-4">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 text-left">รหัส</th>
                          <th className="p-2 text-left">ชื่อ</th>
                          <th className="p-2 text-center">ดูทักษะ</th>
                          <th className="p-2 text-center">ลบ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((s) => (
                          <tr key={s.id} className="border-t hover:bg-gray-50">
                            <td className="p-2">{s.student_code}</td>
                            <td className="p-2">{s.full_name}</td>
                            <td className="p-2 text-center">
                              <button
                                onClick={() => handleSelectStudent(s)}
                                className="text-blue-600 hover:underline"
                              >
                                ดูทักษะ
                              </button>
                            </td>
                            <td className="p-2 text-center">
                              <button
                                onClick={() => handleRemove(s.id!)}
                                className="text-red-600 hover:underline"
                              >
                                ลบ
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h3 className="font-medium mb-2">เพิ่มนักศึกษาที่ยังไม่มีอาจารย์</h3>
                  <div className="flex flex-wrap gap-2">
                    {unassignedStudents.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleAssign(s.id!)}
                        className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-500"
                      >
                        {s.student_code} - {s.full_name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <p className="text-gray-600">กรุณาเลือกอาจารย์</p>
          )}
        </div>
      </div>

      {/* รายละเอียดทักษะนักศึกษา */}
      {selectedStudent && (
        <section className="grid md:grid-cols-2 gap-6 mt-10">
          {/* ทักษะที่มี */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <BookOpen size={20} /> ทักษะที่มีของ {selectedStudent.full_name}
            </h2>
            {loadingSkills ? (
              <p className="text-gray-500">กำลังโหลด...</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">ชื่อทักษะ</th>
                    <th className="p-2 text-center">ระดับ</th>
                    <th className="p-2 text-center">อัปเดตเมื่อ</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSkills.length > 0 ? (
                    currentSkills.map((s) => (
                      <tr key={s.skill_id} className="border-t hover:bg-gray-50">
                        <td className="p-2">{s.name_th}</td>
                        <td className="p-2 text-center">{s.level}</td>
                        <td className="p-2 text-center">{formatDateThaiA(s.updated_at)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-500">
                        ไม่มีทักษะ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* ประวัติทักษะ */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <BookText size={20} /> ประวัติการได้รับทักษะ
            </h2>
            {loadingLogs ? (
              <p className="text-gray-500">กำลังโหลด...</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">ชื่อทักษะ</th>
                    <th className="p-2 text-center">ระดับ</th>
                    <th className="p-2">กิจกรรม</th>
                    <th className="p-2">หมายเหตุ</th>
                    <th className="p-2 text-center">วันที่</th>
                  </tr>
                </thead>
                <tbody>
                  {skillLogs.length > 0 ? (
                    skillLogs.map((log, i) => (
                      <tr key={`${log.skill_id}-${log.evaluated_at}-${i}`} className="border-t hover:bg-gray-50">
                        <td className="p-2">{log.name_th}</td>
                        <td className="p-2 text-center">{log.level}</td>
                        <td className="p-2">{log.activity_name}</td>
                        <td className="p-2">{log.note || '—'}</td>
                        <td className="p-2 text-center">{formatDateThaiA(log.evaluated_at)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500">
                        ยังไม่มีข้อมูล
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
