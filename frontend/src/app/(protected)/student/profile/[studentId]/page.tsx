"use client";

import { ReactNode, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
	User,
	IdCard,
	GraduationCap,
	Mail,
	Phone,
	MessageCircle,
	School,
	BookOpenCheck,
	LineChart,
	CalendarDays,
	ChevronLeft,
	ChevronRight,
	BadgeInfo,
	Baby,
	CheckCircle2,
} from "lucide-react";
import Loading from "@/components/Loading";
import {
	getStudentFullDetail,
	getStudentProgress,
	getStudentActivityHistory,
} from "@/lib/student";
import { formatDateThaiA } from "@/lib/utils/date";

const PER_PAGE = 4;

/* ---------------- mini component – skill badge ---------------- */
type SkillEntry = {
	name_th: string;
	name_en: string;
	level_have: number;
	level_required: number;
};

type Progress = {
	percent: number;
	units_have: number;
	units_required: number;
	completed: {
		hard: SkillEntry[];
		soft: SkillEntry[];
	};
	partial: {
		hard: SkillEntry[];
		soft: SkillEntry[];
	};
	missing: {
		hard: SkillEntry[];
		soft: SkillEntry[];
	};
};

type Student = {
	gender: string;
	birth_date: string;
	student_id: string;
	student_status: ReactNode;
	professor_name: string;
	student_code: string;
	full_name: string;
	profile_picture_url?: string;
	year: number;
	email?: string;
	phone?: string;
	line_id?: string;
	faculty: string;
	major: string;
	curriculum_name?: string;
};

type Skill = {
	skill_id: string;
	name_th: string;
	name_en: string;
	skill_type: string;
	skill_level: number;
};

type Activities = {
	activity_id: string;
	name: string;
	event_date: string;
	cover_image_url?: string;
	skills: Skill[];
};

function SkillBox({ s }: { s: SkillEntry }) {
	const color =
		s.level_have >= s.level_required
			? "bg-emerald-100 text-emerald-700"
			: s.level_have > 0
			? "bg-yellow-100 text-yellow-700"
			: "bg-red-100 text-red-700";

	return (
		<li
			className={`rounded-full px-3 py-1 text-[11px] font-medium ${color}`}
		>
			{s.name_th} ({s.level_have}/{s.level_required})
		</li>
	);
}

/* ---------------- page component ------------------------------ */
export default function StudentProfilePage() {
	const { studentId } = useParams() as { studentId: string };

	const [student, setStudent] = useState<Student | null>(null);
	const [progress, setProgress] = useState<Progress | null>(null);
	const [activities, setActivities] = useState<Activities[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);

	useEffect(() => {
		if (!studentId) return;
		(async () => {
			try {
				const [stu, prog, acts] = await Promise.all([
					getStudentFullDetail(studentId),
					getStudentProgress(studentId),
					getStudentActivityHistory(studentId),
				]);
				setStudent(stu);
				setProgress(prog);
				setActivities(
					acts.map((act) => ({
						...act,
						cover_image_url: act.cover_image_url ?? undefined,
						skills: act.skills.map((s) => ({
							skill_id: s.skill_id,
							name_th: s.name_th,
							name_en: s.name_en,
							skill_type: s.skill_type ?? "",
							skill_level: s.skill_level ?? 1,
						})),
					}))
				);
			} catch (e) {
				alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
				console.error(e);
			} finally {
				setLoading(false);
			}
		})();
	}, [studentId]);

	if (loading) return <Loading />;

	if (!student || !progress)
		return (
			<div className="p-6 text-center text-red-600">
				ไม่พบข้อมูลนักศึกษา
			</div>
		);

	const { percent, units_have, units_required, completed, partial, missing } =
		progress;
	const totalPages = Math.ceil(activities.length / PER_PAGE);
	const showActs = activities.slice((page - 1) * PER_PAGE, page * PER_PAGE);

	/* ---------------------------- UI ---------------------------- */
	return (
		<div className="mx-auto max-w-6xl space-y-14 px-4 py-10">
			{/* ===== headline & progress ===== */}
			<header className="space-y-4">
				<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-3 text-gray-800">
						<User className="h-8 w-8 text-blue-600" />
						<h1 className="text-3xl font-bold">โปรไฟล์นักศึกษา</h1>
					</div>
					<span className="rounded-full bg-indigo-50 px-4 py-1 text-sm font-medium text-indigo-700">
						ความคืบหน้า: {percent}% ({units_have}/{units_required}{" "}
						หน่วย)
					</span>
				</div>

				{/* progress bar */}
				<div className="h-3 w-full rounded-full bg-gray-200">
					<div
						className="h-full rounded-full bg-indigo-600 transition-all duration-500"
						style={{ width: `${percent}%` }}
					/>
				</div>
			</header>

			{/* ===== info + skills ===== */}
			<section className="grid gap-8 md:grid-cols-2">
				{/* -------- info card -------- */}
				<article className="space-y-6 rounded-2xl bg-white p-6 shadow">
					<div className="flex items-center gap-4">
						<Image
							src={
								student.profile_picture_url ||
								"/Portrait_Placeholder.png"
							}
							alt="avatar"
							width={88}
							height={88}
							className="h-22 w-22 rounded-2xl object-cover "
						/>
						<div className="space-y-1">
							<h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
								<User className="h-5 w-5 text-blue-600" />
								{student.full_name}
							</h2>
							<p className="flex items-center gap-1 text-sm text-gray-500">
								<IdCard className="h-4 w-4" />
								รหัส:{" "}
								<span className="font-medium">
									{student.student_code}
								</span>
							</p>
							<p className="flex items-center gap-1 text-sm text-gray-500">
								<GraduationCap className="h-4 w-4" />
								ชั้นปี:{" "}
								<span className="font-medium">
									{student.year}
								</span>
							</p>
						</div>
					</div>

					<div className="grid gap-4 text-sm sm:grid-cols-2">
						<p className="flex items-center gap-2">
							<Mail className="h-4 w-4 text-gray-500" />
							{student.email || "-"}
						</p>
						<p className="flex items-center gap-2">
							<Phone className="h-4 w-4 text-gray-500" />
							{student.phone || "-"}
						</p>
						<p className="flex items-center gap-2">
							<MessageCircle className="h-4 w-4 text-gray-500" />
							LINE: {student.line_id || "-"}
						</p>
						<p className="flex items-center gap-2">
							<School className="h-4 w-4 text-gray-500" />
							คณะ: {student.faculty}
						</p>
						<p className="flex items-center gap-2">
							<BadgeInfo className="h-4 w-4 text-gray-500" />
							ภาควิชา: {student.major}
						</p>
						<p className="flex items-center gap-2">
							<LineChart className="h-4 w-4 text-gray-500" />
							หลักสูตร: {student.curriculum_name || "-"}
						</p>
						<p className="flex items-center gap-2">
							<Baby className="h-4 w-4 text-gray-500" />
							เพศ: {student.gender || "-"}
						</p>
						<p className="flex items-center gap-2">
							<CalendarDays className="h-4 w-4 text-gray-500" />
							วันเกิด:{" "}
							{student.birth_date
								? formatDateThaiA(student.birth_date)
								: "-"}
						</p>
						<p className="flex items-center gap-2 col-span-full">
							<CheckCircle2 className="h-4 w-4 text-gray-500" />
							สถานะ: {student.student_status}
						</p>
						<p className="flex items-center gap-2 col-span-full">
							<User className="h-4 w-4 text-gray-500" />
							อาจารย์ที่ปรึกษา: {student.professor_name || "-"}
						</p>
					</div>
				</article>

				{/* -------- skills card -------- */}
				<article className="space-y-6 rounded-2xl bg-white p-6 shadow">
					<h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
						<LineChart className="h-5 w-5 text-indigo-600" />
						ภาพรวมทักษะ
					</h3>

					<div className="space-y-8">
						{[
							{
								label: "สำเร็จแล้ว",
								data: completed,
								color: "emerald",
							},
							{
								label: "กำลังพัฒนา",
								data: partial,
								color: "yellow",
							},
							{
								label: "ยังไม่เริ่ม",
								data: missing,
								color: "red",
							},
						].map(({ label, data, color }) => (
							<div key={label} className="space-y-2">
								<p
									className={`font-semibold text-${color}-700`}
								>
									{label}
								</p>
								<ul className="flex flex-wrap gap-2">
									{[...data.hard, ...data.soft].map(
										(s: SkillEntry) => (
											<SkillBox key={s.name_en} s={s} />
										)
									)}
								</ul>
							</div>
						))}
					</div>
				</article>
			</section>

			{/* ===== activities ===== */}
			<section className="space-y-8">
				<h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
					<BookOpenCheck className="h-6 w-6 text-blue-600" />
					กิจกรรมที่เคยเข้าร่วม
				</h2>

				{activities.length === 0 ? (
					<p className="italic text-gray-500">
						ยังไม่มีกิจกรรมที่เสร็จสิ้น
					</p>
				) : (
					<>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
							{showActs.map((act) => (
								<article
									key={act.activity_id}
									className="overflow-hidden rounded-2xl bg-white shadow transition hover:shadow-md"
								>
									<div className="relative aspect-[16/9] bg-gray-100">
										<Image
											src={
												act.cover_image_url ||
												"/data-science-and-visualization-with-python.jpg"
											}
											alt={act.name}
											fill
											className="object-cover"
										/>
									</div>
									<div className="space-y-2 p-4 text-sm">
										<h3 className="line-clamp-2 font-semibold text-gray-800">
											{act.name}
										</h3>
										<p className="flex items-center gap-1 text-xs text-gray-500">
											<CalendarDays className="h-4 w-4" />
											{formatDateThaiA(act.event_date)}
										</p>
										<ul className="flex flex-wrap gap-1">
											{act.skills.map((s) => (
												<li
													key={s.skill_id}
													className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700"
												>
													{s.name_th}
												</li>
											))}
										</ul>
									</div>
								</article>
							))}
						</div>

						{/* pagination */}
						{totalPages > 1 && (
							<nav className="flex items-center justify-center gap-2 pt-4">
								<button
									disabled={page === 1}
									onClick={() => setPage((p) => p - 1)}
									className="rounded-full p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
								>
									<ChevronLeft className="h-4 w-4" />
								</button>
								{Array.from({ length: totalPages }).map(
									(_, i) => {
										const p = i + 1;
										return (
											<button
												key={p}
												onClick={() => setPage(p)}
												className={`rounded-full px-3 py-1 text-sm ${
													page === p
														? "bg-gray-900 text-white"
														: "bg-white text-gray-800 hover:bg-gray-100"
												}`}
											>
												{p}
											</button>
										);
									}
								)}
								<button
									disabled={page === totalPages}
									onClick={() => setPage((p) => p + 1)}
									className="rounded-full p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
								>
									<ChevronRight className="h-4 w-4" />
								</button>
							</nav>
						)}
					</>
				)}
			</section>
		</div>
	);
}
