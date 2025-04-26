"use client";

import { useState } from "react";
import Image from "next/image";

const ITEMS_PER_PAGE = 3;

const student = {
	name: "นางสาวพิมพ์ใจ แสนดี",
	id: "65123456",
	advisor: "ผศ. ดร. สมชาย ใจดี",
	department: "สาขาวิทยาการคอมพิวเตอร์",
};

const activities = [
	{
		id: 1,
		name: "อบรมการเขียนโปรแกรมเบื้องต้น",
		date: "2025-03-10",
		imageUrl: "/placeholder.png", // ✅ เปลี่ยนจาก URL ข้างนอกไปใช้ local
		description: "เรียนรู้พื้นฐาน Python และการเขียนโค้ดเบื้องต้น",
		skills: [
			{ name: "Programming", level: 2, type: "hard" },
			{ name: "Problem Solving", level: 2, type: "soft" },
		],
		category: "วิชาการ",
	},
	{
		id: 2,
		name: "จิตอาสาพัฒนาโรงเรียน",
		date: "2025-02-25",
		imageUrl: "/placeholder.png",
		description: "ร่วมทำความสะอาดและปรับปรุงพื้นที่โรงเรียน",
		skills: [
			{ name: "Teamwork", level: 4, type: "soft" },
			{ name: "Leadership", level: 3, type: "soft" },
		],
		category: "จิตอาสา",
	},
	{
		id: 3,
		name: "เข้าร่วมแข่งขันตอบปัญหาไอที",
		date: "2025-01-15",
		imageUrl: "/placeholder.png",
		description: "แข่งขันตอบคำถามด้านเทคโนโลยี",
		skills: [
			{ name: "Critical Thinking", level: 3, type: "soft" },
			{ name: "Technical Knowledge", level: 2, type: "hard" },
		],
		category: "การแข่งขัน",
	},
	{
		id: 4,
		name: "ฝึกอบรมการสื่อสารองค์กร",
		date: "2025-04-01",
		imageUrl: "/placeholder.png",
		description: "อบรมพัฒนาทักษะการสื่อสารอย่างมืออาชีพ",
		skills: [
			{ name: "Communication", level: 2, type: "soft" },
			{ name: "Public Speaking", level: 3, type: "soft" },
		],
		category: "พัฒนาตนเอง",
	},
	{
		id: 5,
		name: "โครงการพัฒนาทักษะการวิเคราะห์ข้อมูล",
		date: "2025-05-15",
		imageUrl: "/placeholder.png",
		description: "เวิร์กช็อปเกี่ยวกับการวิเคราะห์ข้อมูลพื้นฐาน",
		skills: [
			{ name: "Data Analysis", level: 3, type: "hard" },
			{ name: "Critical Thinking", level: 2, type: "soft" },
		],
		category: "วิชาการ",
	},
];

export default function MyProfile() {
	const [currentPage, setCurrentPage] = useState(1);

	const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);

	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentItems = activities.slice(
		startIndex,
		startIndex + ITEMS_PER_PAGE
	);

	const onPageChange = (page: number) => setCurrentPage(page);

	return (
		<div className="min-h-screen font-sans bg-gray-50">
			{/* Main */}
			<div className="px-6 sm:px-10 md:px-20 lg:px-32 py-10 space-y-10">
				<h1 className="text-4xl font-bold text-center">My Profile</h1>

				{/* Student Information */}
				<section className="space-y-6">
					<h2 className="text-2xl font-bold">Information</h2>

					<div className="bg-white shadow-lg rounded-xl p-6 flex flex-col sm:flex-row">
						{/* Student Info */}
						<div className="flex-1 p-6 border-b sm:border-b-0 sm:border-r">
							<h3 className="text-xl font-bold mb-4">
								Student Info
							</h3>
							<p className="text-gray-700">
								<span className="font-semibold">
									ชื่อ-นามสกุล:
								</span>{" "}
								{student.name}
							</p>
							<p className="text-gray-700">
								<span className="font-semibold">
									รหัสนักศึกษา:
								</span>{" "}
								{student.id}
							</p>
							<p className="text-gray-700">
								<span className="font-semibold">
									อาจารย์ที่ปรึกษา:
								</span>{" "}
								{student.advisor}
							</p>
							<p className="text-gray-700">
								<span className="font-semibold">สาขาวิชา:</span>{" "}
								{student.department}
							</p>
						</div>

						{/* Soft Skills */}
						<div className="flex-1 p-6 border-b sm:border-b-0 sm:border-r">
							<h3 className="text-xl font-bold mb-4">
								Soft Skills
							</h3>
							<ul className="list-disc list-inside text-gray-700 space-y-1">
								{activities
									.flatMap((a) => a.skills)
									.filter((s) => s.type === "soft")
									.map((skill, idx) => (
										<li key={`soft-${idx}`}>
											{skill.name} - {skill.level}
										</li>
									))}
							</ul>
						</div>

						{/* Hard Skills */}
						<div className="flex-1 p-6">
							<h3 className="text-xl font-bold mb-4">
								Hard Skills
							</h3>
							<ul className="list-disc list-inside text-gray-700 space-y-1">
								{activities
									.flatMap((a) => a.skills)
									.filter((s) => s.type === "hard")
									.map((skill, idx) => (
										<li key={`hard-${idx}`}>
											{skill.name} - {skill.level}
										</li>
									))}
							</ul>
						</div>
					</div>
				</section>

				{/* Activities */}
				<section className="space-y-6">
					<h2 className="text-2xl font-bold">
						กิจกรรมที่เคยเข้าร่วม
					</h2>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{currentItems.map((activity) => (
							<div
								key={activity.id}
								className="border rounded-2xl p-5 shadow-md bg-white space-y-4"
							>
								<h2 className="text-xl font-semibold">
									{activity.name}
								</h2>
								<p className="text-sm text-gray-500">
									วันที่เข้าร่วม: {activity.date}
								</p>
								<div className="relative w-full h-56 rounded-md overflow-hidden">
									<Image
										src={activity.imageUrl}
										alt={activity.name}
										width={600}
										height={400}
										className="object-cover w-full h-full rounded-md"
									/>
								</div>
								<p className="mt-2 text-gray-700">
									{activity.description}
								</p>
								<p className="text-sm font-medium">
									{activity.category}
								</p>
								<div>
									<p className="font-semibold mb-2">
										ทักษะที่ได้รับ:
									</p>
									<div className="flex flex-wrap gap-2">
										{activity.skills.map((skill, i) => (
											<span
												key={i}
												className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
											>
												{skill.name} ({skill.type}) -
												ระดับ: {skill.level}
											</span>
										))}
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex justify-center mt-8 space-x-2">
							{Array.from({ length: totalPages }, (_, idx) => {
								const page = idx + 1;
								return (
									<button
										key={page}
										onClick={() => setCurrentPage(page)}
										className={`px-4 py-2 rounded-lg border font-medium transition-all duration-200 ${
											page === currentPage
												? "bg-[#E63946] text-white border-[#E63946]"
												: "bg-white text-[#E63946] border-[#E63946] hover:bg-[#E63946] hover:text-white"
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
		</div>
	);
}
