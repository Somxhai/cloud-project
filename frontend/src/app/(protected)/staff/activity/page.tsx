"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllActivitiesWithSkills } from "@/lib/activity";
import { ActivityWithSkills } from "@/types/models";
import { formatDateThai } from "@/lib/utils/date";
import { Pencil, Settings, Users2, CalendarCheck, Globe } from "lucide-react";

export default function StaffActivitiesPage() {
	const [activityList, setActivityList] = useState<ActivityWithSkills[]>([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				const data = await getAllActivitiesWithSkills();
				setActivityList(data);
			} catch (err) {
				console.error("Failed to load activities:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchActivities();
	}, []);

	const filtered = activityList.filter((a) =>
		a.name.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div className="px-6 py-10 sm:px-16  text-gray-900">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
				<h1 className="text-2xl sm:text-3xl font-bold">
					จัดการกิจกรรม
				</h1>

				<div className="flex gap-2 flex-wrap">
					<Link
						href="/staff/activity/new"
						className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg text-sm sm:text-base font-medium"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4v16m8-8H4"
							/>
						</svg>
						เพิ่มกิจกรรม
					</Link>
				</div>
			</div>

			<div className="mb-6">
				<input
					type="text"
					placeholder="ค้นหากิจกรรม..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full sm:w-[300px] px-4 py-2 rounded border border-gray-300 text-sm"
				/>
			</div>

			<div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
				<h2 className="text-xl font-semibold text-center mb-4">
					กิจกรรมทั้งหมด
				</h2>

				{loading ? (
					<div className="text-center py-6 text-gray-500">
						กำลังโหลด...
					</div>
				) : (
					<table className="w-full text-sm border-collapse">
						<thead>
							<tr className="bg-gray-100 text-left text-sm text-gray-600">
								<th className="p-3 font-semibold">
									ชื่อกิจกรรม
								</th>
								<th className="p-3 font-semibold">
									วันกิจกรรม
								</th>
								<th className="p-3 font-semibold">สถานะ</th>
								<th className="p-3 font-semibold">
									ผู้เข้าร่วม
								</th>
								<th className="p-3 font-semibold">เผยแพร่</th>
								<th className="p-3 font-semibold text-center">
									การจัดการ
								</th>
							</tr>
						</thead>
						<tbody>
							{filtered.length > 0 ? (
								filtered.map((activity) => (
									<tr
										key={activity.id}
										className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
									>
										<td className="p-3 font-medium text-gray-800">
											{activity.name}
										</td>
										<td className="p-3 text-gray-600">
											<CalendarCheck
												size={14}
												className="inline-block mr-1 text-blue-500"
											/>
											{formatDateThai(
												activity.event_date
											)}
										</td>
										<td className="p-3 text-gray-700">
											{
												{
													0: (
														<span className="text-blue-600">
															เปิดรับ
														</span>
													),
													1: (
														<span className="text-yellow-600">
															ปิดรับ
														</span>
													),
													2: (
														<span className="text-red-600">
															ยกเลิก
														</span>
													),
													3: (
														<span className="text-green-600">
															เสร็จสิ้น
														</span>
													),
												}[activity.status]
											}
										</td>
										<td className="p-3 text-gray-700">
											<Users2
												size={14}
												className="inline-block mr-1 text-gray-500"
											/>
											{activity.amount}/
											{activity.max_amount}
										</td>
										<td className="p-3 text-gray-700">
											<Globe
												size={14}
												className={`inline-block mr-1 ${
													activity.is_published
														? "text-green-600"
														: "text-gray-400"
												}`}
											/>
											{activity.is_published
												? "เผยแพร่แล้ว"
												: "ไม่เผยแพร่"}
										</td>
										<td className="p-3 text-center flex justify-center gap-3">
											<Link
												href={`/staff/activity/edit/${activity.id}`}
												className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
											>
												<Pencil size={14} /> แก้ไข
											</Link>
											<Link
												href={`/staff/activity/${activity.id}`}
												className="inline-flex items-center gap-1 text-gray-800 hover:text-green-700 text-sm"
											>
												<Settings size={14} /> จัดการ
											</Link>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={6}
										className="text-center p-6 text-gray-500"
									>
										ไม่พบกิจกรรม
									</td>
								</tr>
							)}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
