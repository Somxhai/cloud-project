"use client";

import { useState } from "react";
import Image from "next/image";

export default function NewActivityPage() {
  const [form, setForm] = useState({
    name: "",
    date: "",
    participants: 0,
    skillType: "hard",
    image: null as File | null,
  });
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setForm((prev) => ({ ...prev, image: file }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: name === "participants" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit:", form);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center max-w-sm w-full mx-4">
            <Image src="/antivity2.png" alt="Success Icon" width={40} height={40} className="mb-4" />
            <h2 className="text-xl font-bold text-black mb-2">เพิ่มกิจกรรมสำเร็จ 🎉</h2>
            <button
              onClick={handleCloseModal}
              className="mt-6 bg-[#EF4444] hover:bg-[#DC2626] text-white px-6 py-2 rounded-md text-sm font-semibold"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}

      {/* Top Red Bar */}
      <div className="bg-[#EF4444] h-[32px] w-full" />

      {/* Logo Center */}
      <div className="flex justify-left mt-3 ml-10">
        <Image src="/antivity1.png" alt="Logo" width={120} height={40} />
      </div>

      {/* Gray Divider Line */}
      <div className="border-t border-gray-300 mt-3 w-full" />

      {/* Form */}
      <main className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="bg-white shadow-[0px_4px_20px_0px_rgba(239,68,68,0.2)] rounded-xl p-8 w-full max-w-sm">
          {/* Title Left */}
          <div className="flex items-center mb-6">
            <Image src="/antivity2.png" alt="Antivity Icon" width={32} height={32} />
            <h1 className="text-xl font-bold text-black ml-2">เพิ่มกิจกรรม</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-black mb-1">
                ชื่อกิจกรรม <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-black rounded-md px-3 py-1.5 text-sm text-black focus:ring-[#EF4444] focus:border-[#EF4444]"
                placeholder="เช่น กิจกรรมอบรม AI"
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-black mb-1">
                วันที่จัดกิจกรรม <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full border border-black rounded-md px-3 py-1.5 text-sm text-black focus:ring-[#EF4444] focus:border-[#EF4444]"
              />
            </div>

            {/* Participants */}
            <div>
              <label htmlFor="participants" className="block text-sm font-semibold text-black mb-1">
                จำนวนผู้เข้าร่วม <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="participants"
                name="participants"
                value={form.participants}
                onChange={handleChange}
                min={0}
                required
                className="w-full border border-black rounded-md px-3 py-1.5 text-sm text-black focus:ring-[#EF4444] focus:border-[#EF4444]"
              />
            </div>

            {/* Skill Type */}
            <div>
              <label htmlFor="skillType" className="block text-sm font-semibold text-black mb-1">
                ประเภททักษะ <span className="text-red-500">*</span>
              </label>
              <select
                id="skillType"
                name="skillType"
                value={form.skillType}
                onChange={handleChange}
                required
                className="w-full border border-black rounded-md px-3 py-1.5 text-sm text-black focus:ring-[#EF4444] focus:border-[#EF4444]"
              >
                <option value="hard">Hard Skill</option>
                <option value="soft">Soft Skill</option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-semibold text-black mb-1">
                รูปกิจกรรม
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-black file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#FEE2E2] file:text-[#B91C1C] hover:file:bg-[#FCA5A5]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold py-2 rounded-md shadow-sm transition text-sm"
              >
                สร้างกิจกรรม
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
