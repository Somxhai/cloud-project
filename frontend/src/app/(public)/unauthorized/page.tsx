"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftCircle } from "lucide-react";
import Image from "next/image";

export default function UnauthorizedPage() {
	const router = useRouter();

	return (
		<div className="min-h-screen flex items-center justify-center  px-4 py-8">
			<div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md flex flex-col items-center space-y-6">
				{/* โลโก้เว็บ */}
				<Image
					width={100}
					height={100}
					src="/logomain.svg"
					alt="Website Logo"
					className="h-14"
				/>

				{/* ไอคอนแจ้งเตือน */}
				<div className="bg-red-100 rounded-full p-3">
					<ArrowLeftCircle className="h-10 w-10 text-red-600" />
				</div>

				{/* ข้อความหลัก */}
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-800 mb-2">
						เข้าถึงไม่ได้
					</h1>
					<p className="text-gray-600 text-sm">
						คุณไม่มีสิทธิ์เข้าถึงหน้านี้
						กรุณาตรวจสอบสิทธิ์ผู้ใช้งานของคุณ
					</p>
				</div>

				{/* ปุ่มย้อนกลับ */}
				<button
					onClick={() => router.back()}
					className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
				>
					กลับหน้าก่อนหน้า
				</button>
			</div>
		</div>
	);
}
