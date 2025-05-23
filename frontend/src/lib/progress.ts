import type { CurriculumProgress } from "@/types/models";

// const BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/** GET /progress/curriculum/:id */
export async function getCurriculumProgress(
	id: string
): Promise<CurriculumProgress> {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_BASE_URL}/progress/curriculum/${id}`,
		{
			cache: "no-store",
		}
	);
	if (!res.ok) throw new Error("โหลด progress หลักสูตรไม่สำเร็จ");
	return res.json();
}
