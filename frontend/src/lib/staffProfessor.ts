import { Professor, Student } from "@/types/models";
import { getAuthHeaders } from "./utils/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";


export async function getAllProfessors(): Promise<Professor[]> {
    const res = await fetch(`${BASE_URL}/professor/staff/professors`, {
        headers: await getAuthHeaders(),
    });
    if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลอาจารย์");
    return res.json();
}

export async function getStudentsByProfessor(professorId: string): Promise<Student[]> {
    const res = await fetch(`${BASE_URL}/professor/staff/professors/${professorId}/students`, {
        headers: await getAuthHeaders(),
    });
    if (!res.ok) throw new Error("ไม่สามารถโหลดนักศึกษาในที่ปรึกษา");
    return res.json();
}

export async function getUnassignedStudents(): Promise<Student[]> {
    const res = await fetch(`${BASE_URL}/professor/staff/students/unassigned`, {
        headers: await getAuthHeaders(),
    });
    if (!res.ok) throw new Error("ไม่สามารถโหลดนักศึกษาที่ยังไม่มีอาจารย์ที่ปรึกษา");
    return res.json();
}

export async function assignStudentToProfessor(professorId: string, studentId: string) {
    const res = await fetch(`${BASE_URL}/professor/staff/professors/${professorId}/students/${studentId}`, {
        method: "POST",
        headers: await getAuthHeaders(),
    });
    if (!res.ok) throw new Error("เพิ่มนักศึกษาเข้าอาจารย์ไม่สำเร็จ");
    return res.json();
}

export async function removeStudentFromProfessor(professorId: string, studentId: string) {
    const res = await fetch(`${BASE_URL}/professor/staff/professors/${professorId}/students/${studentId}`, {
        method: "DELETE",
        headers: await getAuthHeaders(),
    });
    if (!res.ok) throw new Error("ลบนักศึกษาออกจากอาจารย์ไม่สำเร็จ");
}
