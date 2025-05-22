// src/app/staff/skill/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
	getAllSkills,
	createSkill,
	deleteSkill,
	updateSkill,
} from "@/lib/skill";
import type { Skill } from "@/types/models";
import {
	Plus,
	Save,
	X,
	Edit3,
	Trash2,
	Loader2,
	ToggleLeft,
	ToggleRight,
	Search,
	ArrowRightLeft,
	ArrowLeftRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* types & helpers                                                    */
/* ------------------------------------------------------------------ */
// type SkillType = 'soft' | 'hard';
const emptyForm = (): NewSkill => ({
	name_th: "",
	name_en: "",
	description: "",
	skill_type: "soft",
	is_active: true,
});
type NewSkill = Omit<Skill, "id" | "icon_url">;

/* ------------------------------------------------------------------ */
/* main component                                                     */
/* ------------------------------------------------------------------ */
export default function SkillManagementPage() {
	const [skills, setSkills] = useState<Skill[]>([]);
	const [loading, setLoading] = useState(true);

	/* ---------- add modal ---------- */
	const [showAdd, setShowAdd] = useState(false);
	const [form, setForm] = useState<NewSkill>(emptyForm());
	const [savingAdd, setSavingAdd] = useState(false);

	/* ---------- per-card editing ---------- */
	const [editingId, setEditingId] = useState<string | null>(null);
	const [draft, setDraft] = useState<Record<string, Skill>>({}); // id ➜ draft

	/* ---------- filter ---------- */
	const [query, setQuery] = useState("");
	const [tab, setTab] = useState<"all" | "soft" | "hard">("all");

	/* ---------------------------------------------------------------- */
	/* fetch                                                            */
	/* ---------------------------------------------------------------- */
	useEffect(() => {
		getAllSkills()
			.then(setSkills)
			.finally(() => setLoading(false));
	}, []);

	/* ---------------------------------------------------------------- */
	/* add – handlers                                                   */
	/* ---------------------------------------------------------------- */
	const handleAdd = async () => {
		if (!form.name_th.trim() || !form.name_en.trim()) {
			alert("กรุณากรอกชื่อภาษาไทย/อังกฤษ");
			return;
		}
		setSavingAdd(true);
		try {
			const created = await createSkill({
				...form,
				description: form.description ?? "",
			});
			setSkills((prev) => [...prev, created]);
			setForm(emptyForm());
			setShowAdd(false);
		} finally {
			setSavingAdd(false);
		}
	};

	/* ---------------------------------------------------------------- */
	/* card – handlers                                                  */
	/* ---------------------------------------------------------------- */
	const toggleActive = async (skill: Skill) => {
		const updated = await updateSkill({
			...skill,
			is_active: !skill.is_active,
		});
		setSkills((prev) => prev.map((s) => (s.id === skill.id ? updated : s)));
	};

	const startEdit = (s: Skill) => {
		setEditingId(s.id);
		setDraft({ ...draft, [s.id]: { ...s } });
	};

	const cancelEdit = (id: string) => {
		setEditingId(null);
		setDraft((d) => {
			const x = { ...d };
			delete x[id];
			return x;
		});
	};

	const saveEdit = async (id: string) => {
		const toSave = draft[id];
		if (!toSave) return;
		const updated = await updateSkill(toSave);
		setSkills((prev) => prev.map((s) => (s.id === id ? updated : s)));
		cancelEdit(id);
	};

	const removeSkill = async (id: string) => {
		if (!confirm("ลบทักษะนี้ใช่หรือไม่?")) return;
		await deleteSkill(id);
		setSkills((prev) => prev.filter((s) => s.id !== id));
	};

	/* ---------------------------------------------------------------- */
	/* filter view list                                                 */
	/* ---------------------------------------------------------------- */
	const viewSkills = skills
		.filter((s) => (tab === "all" ? true : s.skill_type === tab))
		.filter(
			(s) =>
				s.name_th.toLowerCase().includes(query.toLowerCase()) ||
				s.name_en?.toLowerCase().includes(query.toLowerCase())
		);

	/* ---------------------------------------------------------------- */
	/* ui                                                               */
	/* ---------------------------------------------------------------- */
	if (loading) {
		return (
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-gray-600">
				<Loader2 className="animate-spin" />
				กำลังโหลดข้อมูล…
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-6xl p-6 space-y-8">
			{/* header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h1 className="text-2xl font-bold">จัดการทักษะ</h1>
				<button
					onClick={() => setShowAdd(true)}
					className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
				>
					<Plus size={16} /> เพิ่มทักษะ
				</button>
			</div>

			{/* filter bar */}
			<div className="flex flex-wrap items-center gap-4">
				<div className="flex gap-1 rounded-lg bg-gray-100 p-1 text-xs font-medium">
					{(["all", "soft", "hard"] as const).map((t) => (
						<button
							key={t}
							onClick={() => setTab(t)}
							className={`rounded-lg px-3 py-1 capitalize ${
								tab === t ? "bg-white shadow" : "text-gray-600"
							}`}
						>
							{t === "all" ? "ทั้งหมด" : t}
						</button>
					))}
				</div>

				<label className="relative ml-auto w-full max-w-xs">
					<Search
						size={14}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
					/>
					<input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="ค้นหาทักษะ"
						className="w-full rounded-lg bg-gray-100 py-1.5 pl-9 pr-3 text-sm focus:bg-white focus:ring-1 focus:ring-blue-500"
					/>
				</label>
			</div>

			{/* skill cards grid */}
			{viewSkills.length === 0 ? (
				<p className="text-center text-gray-500">ไม่พบข้อมูล</p>
			) : (
				<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{viewSkills.map((s) => {
						const isEditing = editingId === s.id;
						const d = draft[s.id] ?? s;
						return (
							<li
								key={s.id}
								className="rounded-xl bg-white p-4 shadow-sm space-y-3"
							>
								{/* top row */}
								<div className="flex items-start justify-between">
									<h3 className="text-sm font-semibold">
										{s.name_th}
									</h3>
									<div className="flex items-center gap-2">
										{isEditing ? (
											<>
												<button
													title="บันทึก"
													onClick={() =>
														saveEdit(s.id)
													}
													className="text-emerald-600"
												>
													<Save size={16} />
												</button>
												<button
													title="ยกเลิก"
													onClick={() =>
														cancelEdit(s.id)
													}
													className="text-gray-500"
												>
													<X size={16} />
												</button>
											</>
										) : (
											<>
												<button
													title="แก้ไข"
													onClick={() => startEdit(s)}
													className="text-blue-600"
												>
													<Edit3 size={16} />
												</button>
												<button
													title="ลบ"
													onClick={() =>
														removeSkill(s.id)
													}
													className="text-red-600"
												>
													<Trash2 size={16} />
												</button>
											</>
										)}
									</div>
								</div>

								{/* english name */}
								{isEditing ? (
									<input
										value={d.name_en}
										onChange={(e) =>
											setDraft((prev) => ({
												...prev,
												[s.id]: {
													...d,
													name_en: e.target.value,
												},
											}))
										}
										className="w-full rounded bg-gray-50 px-2 py-1 text-xs focus:bg-white focus:ring-1 focus:ring-blue-500"
									/>
								) : (
									<p className="text-xs text-gray-500">
										{s.name_en}
									</p>
								)}

								{/* description */}
								{isEditing ? (
									<textarea
										rows={3}
										value={d.description ?? ""}
										onChange={(e) =>
											setDraft((prev) => ({
												...prev,
												[s.id]: {
													...d,
													description: e.target.value,
												},
											}))
										}
										className="w-full rounded bg-gray-50 px-2 py-1 text-xs focus:bg-white focus:ring-1 focus:ring-blue-500"
									/>
								) : s.description ? (
									<p className="line-clamp-3 text-xs text-gray-600">
										{s.description}
									</p>
								) : (
									<p className="text-xs italic text-gray-400">
										—
									</p>
								)}

								{/* footer chips */}
								<div className="flex items-center justify-between text-xs">
									<span
										className={`rounded px-2 py-0.5 font-medium ${
											s.skill_type === "soft"
												? "bg-purple-100 text-purple-700"
												: "bg-green-100 text-green-700"
										}`}
									>
										{s.skill_type}
									</span>

									{/* active toggle */}
									<button
										onClick={() => toggleActive(s)}
										className="flex items-center gap-1"
									>
										{s.is_active ? (
											<>
												<ToggleRight
													className="text-emerald-500"
													size={16}
												/>
												<span className="text-emerald-600">
													Active
												</span>
											</>
										) : (
											<>
												<ToggleLeft
													className="text-gray-400"
													size={16}
												/>
												<span className="text-gray-500">
													Inactive
												</span>
											</>
										)}
									</button>
								</div>
							</li>
						);
					})}
				</ul>
			)}

			{/* add modal */}
			{showAdd && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
					<div className="w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow-lg">
						<header className="flex items-center justify-between">
							<h2 className="text-lg font-semibold">
								เพิ่มทักษะ
							</h2>
							<button onClick={() => setShowAdd(false)}>
								<X size={18} />
							</button>
						</header>

						<input
							placeholder="ชื่อไทย"
							value={form.name_th}
							onChange={(e) =>
								setForm({ ...form, name_th: e.target.value })
							}
							className="w-full rounded-lg bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:ring-1 focus:ring-blue-500"
						/>
						<input
							placeholder="ชื่ออังกฤษ"
							value={form.name_en}
							onChange={(e) =>
								setForm({ ...form, name_en: e.target.value })
							}
							className="w-full rounded-lg bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:ring-1 focus:ring-blue-500"
						/>
						<textarea
							rows={3}
							placeholder="คำอธิบาย"
							value={form.description}
							onChange={(e) =>
								setForm({
									...form,
									description: e.target.value,
								})
							}
							className="w-full rounded-lg bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:ring-1 focus:ring-blue-500"
						/>

						{/* type & active */}
						<div className="flex items-center justify-between gap-4">
							<button
								onClick={() =>
									setForm({
										...form,
										skill_type:
											form.skill_type === "soft"
												? "hard"
												: "soft",
									})
								}
								className={`flex-1 flex items-center justify-center gap-2 rounded-full py-1 text-sm font-medium shadow
    ${
		form.skill_type === "soft"
			? "bg-purple-100 text-purple-700"
			: "bg-green-100 text-green-700"
	}`}
							>
								{form.skill_type === "soft" ? (
									<>
										<ArrowRightLeft size={16} />
										Soft Skill
									</>
								) : (
									<>
										<ArrowLeftRight size={16} />
										Hard Skill
									</>
								)}
							</button>

							<button
								onClick={() =>
									setForm({
										...form,
										is_active: !form.is_active,
									})
								}
								className="flex items-center gap-1 text-sm min-w-[100px] "
							>
								{form.is_active ? (
									<>
										<ToggleRight
											className="text-emerald-500"
											size={24}
										/>
										Active
									</>
								) : (
									<>
										<ToggleLeft
											className="text-gray-400"
											size={24}
										/>
										Inactive
									</>
								)}
							</button>
						</div>

						<button
							disabled={savingAdd}
							onClick={handleAdd}
							className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-60"
						>
							{savingAdd ? (
								<Loader2 size={16} className="animate-spin" />
							) : (
								<Plus size={16} />
							)}
							เพิ่มทักษะ
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
