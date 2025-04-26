"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

// mock data - you will replace with fetch from API
const mockActivity = {
  name: "กิจกรรม AI",
  date: "2025-10-20",
  participants: 100,
  skillType: "hard",
};

export default function EditActivityPage() {
  const { activityId } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    date: "",
    participants: 0,
    skillType: "hard",
  });

  useEffect(() => {
    // simulate fetch from backend using activityId
    // TODO: replace with real API call
    setForm(mockActivity);
  }, [activityId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "participants" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Update:", form);
    // TODO: update via API
    alert("บันทึกกิจกรรมเรียบร้อยแล้ว");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Top Red Bar */}
      <div className="bg-[#EF4444] h-[32px] w-full" />

      {/* Logo Center */}
      <div className="flex justify-left mt-3 ml-10">
        <Image src="/antivity1.png" alt="Logo" width={120} height={40} />
      </div>

      {/* Gray Line */}
      <div className="border-t border-gray-300 mt-3 w-full" />

      {/* Form */}
      <main className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="bg-white shadow-[0px_4px_20px_0px_rgba(239,68,68,0.2)] rounded-xl p-8 w-full max-w-sm">
          {/* Title Left */}
          <div className="flex items-center mb-6">
            <Image src="/antivity2.png" alt="Antivity Icon" width={32} height={32} />
            <h1 className="text-xl font-bold text-black ml-2">แก้ไขกิจกรรม</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-black mb-1">
                ชื่อกิจกรรม
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-black rounded-md px-3 py-1.5 text-sm text-black"
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-black mb-1">
                วันที่จัดกิจกรรม
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border border-black rounded-md px-3 py-1.5 text-sm text-black"
              />
            </div>

            {/* Participants */}
            <div>
              <label htmlFor="participants" className="block text-sm font-semibold text-black mb-1">
                จำนวนผู้เข้าร่วม
              </label>
              <input
                type="number"
                id="participants"
                name="participants"
                value={form.participants}
                onChange={handleChange}
                className="w-full border border-black rounded-md px-3 py-1.5 text-sm text-black"
              />
            </div>

            {/* Skill Type */}
            <div>
              <label htmlFor="skillType" className="block text-sm font-semibold text-black mb-1">
                ประเภททักษะ
              </label>
              <select
                id="skillType"
                name="skillType"
                value={form.skillType}
                onChange={handleChange}
                className="w-full border border-black rounded-md px-3 py-1.5 text-sm text-black"
              >
                <option value="hard">Hard Skill</option>
                <option value="soft">Soft Skill</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-between pt-2 gap-2">
              <button
                type="submit"
                className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold py-2 rounded-md text-sm"
              >
                บันทึก
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 rounded-md text-sm"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
