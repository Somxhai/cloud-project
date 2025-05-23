"use client";

import { useEffect } from "react";
import { signOut } from "@aws-amplify/auth";
import { useRouter } from "next/navigation";
import "@/lib/amplifyConfig";

export default function ForceSignOutPage() {
	const router = useRouter();

	useEffect(() => {
		const logout = async () => {
			try {
				// เคลียร์ session ทั้งหมด
				await signOut({ global: true });
				console.log("Logged out globally");
			} catch (err) {
				console.error("Failed to logout globally:", err);
			} finally {
				// Redirect หลัง logout
				router.replace("/auth/signin");
			}
		};

		logout();
	}, [router]);

	return (
		<div className="min-h-screen flex items-center justify-center text-gray-700">
			<p>กำลังออกจากระบบทั้งหมด...</p>
		</div>
	);
}
