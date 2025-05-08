const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function createStudent(student: {
  id: string;
  user_id: string;
  student_code: string;
  full_name: string;
  faculty: string;
  major: string;
  year: number;
}) {
  const res = await fetch(`${BASE_URL}/student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  if (!res.ok) throw new Error('Failed to create student');
  return res.json();
}

export async function createProfessor(professor: {
  id: string;
    user_id: string;
  full_name: string;
}) {
  const res = await fetch(`${BASE_URL}/professor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(professor),
  });
  if (!res.ok) throw new Error('Failed to create professor');
  return res.json();
}
