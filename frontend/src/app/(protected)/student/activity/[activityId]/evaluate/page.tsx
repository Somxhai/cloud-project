// src/app/(protected)/student/activity/[activityId]/evaluation/page.tsx
'use client';

import { useState,useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { submitActivityEvaluation } from '@/lib/activity';
import {
  ClipboardCheck,
  MessageSquareText,
  Star,
  User,
  ClipboardEdit
} from 'lucide-react';
import { submitFeedback } from '@/lib/student';
import { getCurrentUserId } from '@/lib/auth';



/* ------------------------------------------------------------------ */
/* hard-coded student (replace with auth)                             */
/* ------------------------------------------------------------------ */
//const studentId = 'cac8754c-b80d-4c33-a7c4-1bed9563ee1b';




/* ------------------------------------------------------------------ */
/* component                                                          */
/* ------------------------------------------------------------------ */
export default function ActivityEvaluationPage() {
  const { activityId } = useParams() as { activityId: string };
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();


    /* ---------- fetch ---------- */
    useEffect(() => {
      const load = async () => {
        const id = await getCurrentUserId();
        setUserId(id);
      };
      load();
    }, []);

  const [form, setForm] = useState({
    score_venue: 0,
    score_speaker: 0,
    score_interest: 0,
    score_content: 0,
    score_applicability: 0,
    score_overall: 0,
    comment: '',
    suggestions: '',
    is_anonymous: false,
  });
  const [submitting, setSubmitting] = useState(false);

  /* -------------------------------------------------------------- */
  /* handlers                                                       */
  /* -------------------------------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert('ไม่พบข้อมูลผู้ใช้');
      return;
    }
    setSubmitting(true);
    try {
      await submitActivityEvaluation({
        student_id: userId,
        activity_id: activityId,
        ...form,
        score_venue: +form.score_venue,
        score_speaker: +form.score_speaker,
        score_interest: +form.score_interest,
        score_content: +form.score_content,
        score_applicability: +form.score_applicability,
        score_overall: +form.score_overall,
      });
      await submitFeedback(userId, activityId);
      alert('ส่งแบบประเมินเรียบร้อย');
      router.back();
    } catch (e: any) {
      alert(e.message || 'เกิดข้อผิดพลาด');
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------------------------------------------------- */
  /* ui                                                             */
  /* -------------------------------------------------------------- */
  return (
    <div className="mx-auto max-w-3xl space-y-10 p-6">
      {/* headline */}
      <div className='bg-white shadow-sm rounded-lg p-6'> 
      <header className="flex items-center gap-2 text-2xl font-bold text-gray-800">
        <ClipboardCheck size={24} />
        แบบประเมินกิจกรรม
      </header>

      {/* rating grid */}
      <section className="space-y-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <Star size={18} />
          ให้คะแนน (1–5)
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { label: 'การจัดและสถานที่', name: 'score_venue' },
            { label: 'ผู้บรรยาย / ผู้จัด', name: 'score_speaker' },
            { label: 'ความน่าสนใจ', name: 'score_interest' },
            { label: 'เนื้อหา', name: 'score_content' },
            { label: 'การนำไปใช้ประโยชน์', name: 'score_applicability' },
            { label: 'ภาพรวมกิจกรรม', name: 'score_overall' },
          ].map((f) => (
            <div key={f.name} className="space-y-3">
              <p className="text-sm font-medium text-gray-700">{f.label}</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <label key={v} className="cursor-pointer">
                    <input
                      type="radio"
                      name={f.name}
                      value={v}
                      checked={+form[f.name as keyof typeof form] === v}
                      onChange={handleChange}
                      className="peer hidden"
                    />
                    <div className="grid h-9 w-9 place-items-center rounded-full border border-gray-300 text-sm transition peer-checked:bg-blue-600 peer-checked:text-white hover:bg-blue-50">
                      {v}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* comment fields */}
      <section className="space-y-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <MessageSquareText size={18} />
          ความคิดเห็น
        </h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              ความคิดเห็นทั่วไป
            </label>
            <textarea
              name="comment"
              rows={4}
              value={form.comment}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              ข้อเสนอแนะเพิ่มเติม
            </label>
            <textarea
              name="suggestions"
              rows={4}
              value={form.suggestions}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-0"
            />
          </div>
        </div>
      </section>

      {/* anonymous toggle */}
      <section className="flex items-center gap-2 text-sm">
        <input
          id="anon"
          type="checkbox"
          name="is_anonymous"
          checked={form.is_anonymous}
          onChange={handleChange}
          className="h-4 w-4 accent-blue-600"
        />
        <label htmlFor="anon" className="flex items-center gap-1 text-gray-700">
          <User size={14} /> ไม่เปิดเผยชื่อ
        </label>
      </section>
          </div>
      {/* actions */}
      <footer className="flex justify-end">
        <button
          disabled={submitting}
          onClick={handleSubmit}
          className="rounded-full flex items-center gap-2 bg-blue-600 px-8 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
        >
          <ClipboardEdit size={16} />  ส่งแบบประเมิน
        </button>
      </footer>
    </div>
  );
}
