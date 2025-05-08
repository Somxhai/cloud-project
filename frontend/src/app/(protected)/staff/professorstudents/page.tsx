'use client';

import { useEffect, useState } from 'react';
import {
  getAllProfessors,
  getStudentsByProfessor,
  getUnassignedStudents,
  assignStudentToProfessor,
  removeStudentFromProfessor,
} from '@/lib/staffProfessor';
import type { Professor, Student } from '@/types/models';

export default function ProfessorStudentManagementPage() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [selectedProfessorId, setSelectedProfessorId] = useState<string>('');
  const [selectedProfessorName, setSelectedProfessorName] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [unassignedStudents, setUnassignedStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfessors();
  }, []);

  const loadProfessors = async () => {
    try {
      const data = await getAllProfessors();
      setProfessors(data);
    } catch (error) {
      console.error('ไม่สามารถโหลดรายชื่ออาจารย์ได้', error);
    }
  };

  const loadStudents = async (professorId: string) => {
    setLoading(true);
    try {
      const [assigned, unassigned] = await Promise.all([
        getStudentsByProfessor(professorId),
        getUnassignedStudents(),
      ]);
      setStudents(assigned);
      setUnassignedStudents(unassigned);
    } catch (error) {
      console.error('ไม่สามารถโหลดนักศึกษาได้', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProfessor = (id: string, name: string) => {
    setSelectedProfessorId(id);
    setSelectedProfessorName(name);
    loadStudents(id);
  };

  const handleAssign = async (studentId: string) => {
    try {
      await assignStudentToProfessor(selectedProfessorId, studentId);
      loadStudents(selectedProfessorId);
    } catch (error) {
      alert('เพิ่มนักศึกษาไม่สำเร็จ');
    }
  };

  const handleRemove = async (studentId: string) => {
    try {
      await removeStudentFromProfessor(selectedProfessorId, studentId);
      loadStudents(selectedProfessorId);
    } catch (error) {
      alert('ลบนักศึกษาไม่สำเร็จ');
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 sm:px-16 bg-gray-50 text-gray-900">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">จัดการนักศึกษาในที่ปรึกษา</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* รายชื่ออาจารย์ */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-3">รายชื่ออาจารย์</h2>
          <ul className="space-y-1 text-sm">
            {professors.map((prof) => (
              <li
                key={prof.id}
                className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                  selectedProfessorId === prof.id ? 'bg-blue-100 font-semibold' : ''
                }`}
                onClick={() => handleSelectProfessor(prof.id!, prof.full_name ?? 'ไม่ระบุชื่อ')}
              >
                {prof.full_name}
              </li>
            ))}
          </ul>
        </div>

        {/* รายชื่อนักศึกษาภายใต้ที่ปรึกษา */}
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
                  <table className="w-full table-auto text-sm mb-4">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">รหัส</th>
                        <th className="p-2 text-left">ชื่อ</th>
                        <th className="p-2 text-center">ลบ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length > 0 ? (
                        students.map((s) => (
                          <tr key={s.id} className="border-t hover:bg-gray-50">
                            <td className="p-2">{s.student_code}</td>
                            <td className="p-2">{s.full_name}</td>
                            <td className="p-2 text-center">
                              <button
                                onClick={() => s.id && handleRemove(s.id)}
                                className="text-red-600 hover:underline"
                              >
                                ลบ
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-4 text-center text-gray-500">
                            ไม่มีนักศึกษาในที่ปรึกษานี้
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <h3 className="font-medium mb-2">เพิ่มนักศึกษาที่ยังไม่มีอาจารย์</h3>
                  <div className="flex flex-wrap gap-2">
                    {unassignedStudents.length > 0 ? (
                      unassignedStudents.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => s.id && handleAssign(s.id)}
                          className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-500"
                        >
                          {s.student_code} - {s.full_name}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">ไม่มีนักศึกษารอจับคู่</p>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <p className="text-gray-600">กรุณาเลือกอาจารย์เพื่อดูนักศึกษา</p>
          )}
        </div>
      </div>
    </div>
  );
}
