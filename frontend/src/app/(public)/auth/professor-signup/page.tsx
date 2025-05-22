// src/app/auth/professorsignup/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signUp, confirmSignUp, signOut } from "@aws-amplify/auth";
import { createProfessor } from "@/lib/professor";
import "@/lib/amplifyConfig";
import {
	UserPlus,
	Phone,
	Mail,
	Building2,
	Briefcase,
	Upload,
	Lock,
	ShieldCheck,
	ArrowRight,
	ArrowLeft,
	CheckCircle2,
} from "lucide-react";
import { getAuthHeaders } from "@/lib/utils/auth";
import Image from "next/image";

const positionOptions = [
	"ศาสตราจารย์ ดร.",
	"รองศาสตราจารย์ ดร.",
	"ผู้ช่วยศาสตราจารย์ ดร.",
	"ดร.",
	"อาจารย์",
];

export default function ProfessorSignUpPage() {
	const router = useRouter();
	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const userSubRef = useRef<string | null>(null);
	// const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
	// null
	// );
	const [statusMessage, setStatusMessage] = useState("");

	const [form, setForm] = useState({
		full_name: "",
		email: "",
		phone: "",
		department: "",
		faculty: "",
		position: "",
		profile_picture_url: "",
	});

	const [auth, setAuth] = useState({
		username: "",
		password: "",
		code: "",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setAuth((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		// setProfilePictureFile(file);

		const fd = new FormData();
		fd.append("file", file);
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/upload-image`,
				{
					method: "POST",
					headers: {
						Authorization: (await getAuthHeaders()).Authorization,
					},
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

	const handleSignUp = async () => {
		setError("");
		setLoading(true);
		try {
			const user = await signUp({
				username: auth.username,
				password: auth.password,
				options: { userAttributes: { email: form.email } },
			});
			userSubRef.current = user.userId ?? null;
			setStep(3);
		} catch (err) {
			setError(err.message || "สมัครไม่สำเร็จ");
		}
		setLoading(false);
	};

	const handleConfirm = async () => {
		setError("");
		setLoading(true);
		setStatusMessage("กำลังยืนยันอีเมล...");

		try {
			// ✅ 1. Confirm sign up
			await confirmSignUp({
				username: auth.username,
				confirmationCode: auth.code,
			});

			// ✅ 2. Sign in to get sub
			setStatusMessage("กำลังเข้าสู่ระบบ...");
			const { signIn, fetchAuthSession } = await import(
				"@aws-amplify/auth"
			);
			await signIn({ username: auth.username, password: auth.password });
			const session = await fetchAuthSession();
			const sub = session.tokens?.idToken?.payload?.sub;

			if (!sub) throw new Error("ไม่สามารถดึง user sub จาก token ได้");

			// ✅ 3. Add to group
			setStatusMessage("กำลังเพิ่มเข้ากลุ่ม...");
			await fetch(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/cognito/add-to-group`,
				{
					method: "POST",
					headers: await getAuthHeaders(),
					body: JSON.stringify({
						username: auth.username,
						groupName: "professor",
					}),
				}
			);

			// ✅ 4. Wait for backend to sync
			setStatusMessage("กำลังประมวลผล...");
			await new Promise((r) => setTimeout(r, 3000));

			// ✅ 5. Save to DB
			setStatusMessage("กำลังบันทึกข้อมูลผู้ใช้...");
			await createProfessor({
				id: sub,
				user_id: sub,
				full_name: form.full_name,
				email: form.email,
				phone: form.phone,
				department: form.department,
				faculty: form.faculty,
				position: form.position,
				profile_picture_url: form.profile_picture_url,
			});

			alert("สมัครสมาชิกสำเร็จ");
			await signOut();
			router.push("/auth/signin");
		} catch (err) {
			setError(err.message || "ยืนยันไม่สำเร็จ");
		}

		setStatusMessage("");
		setLoading(false);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] from-gray-100 to-blue-100 px-4 py-10">
			<div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg space-y-6">
				{/* Logo and Title */}
				<div className="text-center space-y-2">
					<Image
						width={128}
						height={64}
						src="/logomain.svg"
						alt="Logo"
						className="mx-auto h-16 w-auto"
					/>
					<h1 className="text-2xl font-bold text-gray-800">
						สมัครสมาชิกอาจารย์
					</h1>
				</div>

				{/* Error Message */}
				{error && (
					<div className="bg-red-100 text-red-700 text-sm rounded px-4 py-2 border border-red-300">
						{error}
					</div>
				)}

				{/* Step 1 - Personal Info */}
				{step === 1 && (
					<div className="space-y-4">
						<Input
							icon={<UserPlus />}
							name="full_name"
							placeholder="ชื่อ-นามสกุล"
							onChange={handleChange}
						/>
						<Input
							icon={<Building2 />}
							name="faculty"
							placeholder="คณะ"
							onChange={handleChange}
						/>
						<Input
							icon={<Briefcase />}
							name="department"
							placeholder="ภาควิชา"
							onChange={handleChange}
						/>
						<Select
							name="position"
							value={form.position}
							onChange={handleChange}
							options={positionOptions}
						/>
						<Input
							icon={<Phone />}
							name="phone"
							placeholder="เบอร์โทรศัพท์"
							onChange={handleChange}
						/>
						<Input
							icon={<Mail />}
							name="email"
							placeholder="อีเมล"
							onChange={handleChange}
						/>
						<Input
							type="file"
							icon={<Upload />}
							accept="image/*"
							onChange={handleFileUpload}
						/>
						{form.profile_picture_url && (
							<Image
								width={96}
								height={96}
								src={form.profile_picture_url}
								alt="preview"
								className="h-24 w-24 rounded-full object-cover mx-auto border"
							/>
						)}
						<button
							disabled={loading}
							onClick={() => setStep(2)}
							className="w-full bg-blue-600 text-white font-semibold py-3 text-base rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-60"
						>
							<ArrowRight className="w-5 h-5" />
							ดำเนินการสมัคร (ถัดไป)
						</button>
						<div className="text-center text-sm text-gray-600 pt-2">
							มีบัญชีอยู่แล้วใช่ไหม?{" "}
							<span
								onClick={() => router.push("/auth/signin")}
								className="text-blue-600 font-medium hover:underline cursor-pointer"
							>
								เข้าสู่ระบบ
							</span>
						</div>
					</div>
				)}

				{/* Step 2 - Auth Info */}
				{step === 2 && (
					<div className="space-y-4">
						<Input
							icon={<UserPlus />}
							name="username"
							placeholder="Username"
							onChange={handleAuthChange}
						/>
						<Input
							icon={<Lock />}
							name="password"
							type="password"
							placeholder="Password"
							onChange={handleAuthChange}
						/>
						<button
							disabled={loading}
							onClick={handleSignUp}
							className="w-full bg-blue-600 text-white font-semibold py-3 text-base rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-60"
						>
							<ArrowRight className="w-5 h-5" />
							ดำเนินการสมัคร (ถัดไป)
						</button>
						<button
							onClick={() => setStep(1)}
							className="text-sm text-gray-500 hover:underline flex items-center justify-center gap-1"
						>
							<ArrowLeft className="w-4 h-4" />
							กลับ
						</button>
					</div>
				)}

				{/* Step 3 - Email Confirmation */}
				{step === 3 && (
					<div className="space-y-4">
						<Input
							icon={<ShieldCheck />}
							name="code"
							placeholder="กรอกรหัสยืนยันจากอีเมล"
							onChange={handleAuthChange}
						/>
						{statusMessage && (
							<div className="text-sm text-gray-600 flex items-center gap-2 justify-center">
								<svg
									className="w-4 h-4 animate-spin text-blue-500"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
									/>
								</svg>
								<span>{statusMessage}</span>
							</div>
						)}

						<button
							disabled={loading}
							onClick={handleConfirm}
							className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium text-white transition
    ${
		loading
			? "bg-gray-400 cursor-not-allowed"
			: "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 focus:ring-2 focus:ring-emerald-300 focus:outline-none"
	}
  `}
						>
							<CheckCircle2 className="w-5 h-5" />
							ยืนยันอีเมลและสมัครสมาชิก
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

/* ------------------------------ helper components ------------------------------ */
function Input({
	icon,
	...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }) {
	return (
		<div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
			{icon && <span className="mr-2 text-gray-400">{icon}</span>}
			<input
				{...props}
				className="w-full text-sm bg-transparent focus:outline-none"
			/>
		</div>
	);
}

function Select({
	name,
	value,
	onChange,
	options,
}: {
	name: string;
	value: string;
	onChange: React.ChangeEventHandler<HTMLSelectElement>;
	options: string[];
}) {
	return (
		<select
			name={name}
			value={value}
			onChange={onChange}
			className="w-full text-sm bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
		>
			<option value="">— เลือกตำแหน่ง —</option>
			{options.map((opt) => (
				<option key={opt} value={opt}>
					{opt}
				</option>
			))}
		</select>
	);
}
