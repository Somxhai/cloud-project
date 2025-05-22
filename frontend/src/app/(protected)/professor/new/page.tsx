"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProfessor } from "@/lib/professor";
import {
	User,
	Mail,
	Phone,
	School,
	Building2,
	Briefcase,
	ImageIcon,
} from "lucide-react";

import Image from "next/image";

const positionOptions = [
	"ศาสตราจารย์ ดร.",
	"รองศาสตราจารย์ ดร.",
	"ผู้ช่วยศาสตราจารย์ ดร.",
	"ดร.",
	"อาจารย์",
];

export default function AddProfessorPage() {
	const router = useRouter();

	/* ------------------------------------------------------------------ */
	/* state                                                              */
	/* ------------------------------------------------------------------ */
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({
		user_id: "",
		full_name: "",
		email: "",
		phone: "",
		department: "",
		faculty: "",
		position: "",
		profile_picture_url: "",
	});

	/* ------------------------------------------------------------------ */
	/* handlers                                                           */
	/* ------------------------------------------------------------------ */
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const fd = new FormData();
		fd.append("file", file);

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/upload-image`,
				{
					method: "POST",
					body: fd,
				}
			);
			if (!res.ok) throw new Error("upload failed");
			const { url } = await res.json();
			setForm((prev) => ({ ...prev, profile_picture_url: url }));
		} catch (err) {
			console.error(err);
			alert("อัปโหลดรูปภาพไม่สำเร็จ");
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await createProfessor({ ...form, id: form.user_id });
			alert("เพิ่มอาจารย์เรียบร้อยแล้ว");
			router.push("/staff/professors");
		} catch (err) {
			console.error(err);
			alert("เกิดข้อผิดพลาดในการเพิ่มอาจารย์");
		} finally {
			setLoading(false);
		}
	};

	/* ------------------------------------------------------------------ */
	/* ui                                                                 */
	/* ------------------------------------------------------------------ */
	return (
		<div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
			<div className="flex items-center gap-2 text-2xl font-bold text-gray-800">
				<User className="h-6 w-6 text-blue-600" />
				เพิ่มอาจารย์ใหม่
			</div>

			<form
				onSubmit={handleSubmit}
				className="space-y-6 rounded-2xl bg-white p-6 shadow"
			>
				{/* Row 1 -------------------------------------------------------- */}
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
							<User className="h-4 w-4 text-gray-500" />
							User ID
						</label>
						<input
							type="text"
							name="user_id"
							value={form.user_id}
							onChange={handleChange}
							required
							className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
						/>
					</div>
					<div>
						<label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
							<User className="h-4 w-4 text-gray-500" />
							ชื่อ-นามสกุล
						</label>
						<input
							type="text"
							name="full_name"
							value={form.full_name}
							onChange={handleChange}
							required
							className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
						/>
					</div>
				</div>

				{/* Row 2 -------------------------------------------------------- */}
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
							<Mail className="h-4 w-4 text-gray-500" />
							อีเมล
						</label>
						<input
							type="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
						/>
					</div>
					<div>
						<label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
							<Phone className="h-4 w-4 text-gray-500" />
							เบอร์โทร
						</label>
						<input
							type="text"
							name="phone"
							value={form.phone}
							onChange={handleChange}
							className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
						/>
					</div>
				</div>

				{/* Row 3 -------------------------------------------------------- */}
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
							<School className="h-4 w-4 text-gray-500" />
							ภาควิชา
						</label>
						<input
							type="text"
							name="department"
							value={form.department}
							onChange={handleChange}
							className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
						/>
					</div>
					<div>
						<label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
							<Building2 className="h-4 w-4 text-gray-500" />
							คณะ
						</label>
						<input
							type="text"
							name="faculty"
							value={form.faculty}
							onChange={handleChange}
							className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
						/>
					</div>
				</div>

				{/* Row 4 -------------------------------------------------------- */}
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
							<Briefcase className="h-4 w-4 text-gray-500" />
							ตำแหน่ง
						</label>
						<select
							name="position"
							value={form.position}
							onChange={handleChange}
							className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
						>
							<option value="">-- เลือกตำแหน่ง --</option>
							{positionOptions.map((pos) => (
								<option key={pos} value={pos}>
									{pos}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
							<ImageIcon className="h-4 w-4 text-gray-500" />
							รูปภาพ (อัปโหลด)
						</label>
						<input
							type="file"
							accept="image/*"
							onChange={handleFileUpload}
							className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
						/>
						{form.profile_picture_url && (
							<Image
								width={96}
								height={96}
								src={form.profile_picture_url}
								alt="preview"
								className="mt-2 h-24 w-24 rounded-full border object-cover"
							/>
						)}
					</div>
				</div>

				{/* Submit ------------------------------------------------------- */}
				<div className="pt-4">
					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-full bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
					>
						{loading ? "กำลังบันทึก..." : "บันทึกอาจารย์"}
					</button>
				</div>
			</form>
		</div>
	);
}
