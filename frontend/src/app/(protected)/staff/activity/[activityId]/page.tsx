// File: src/app/staff/activities/[activityId]/page.tsx
'use client';

import { useEffect, useState, PropsWithChildren } from 'react';
import { useParams } from 'next/navigation';
import {
  getActivityById,
  getActivityParticipants,
  getActivitySkills,
  getActivityEvaluations,
  updateStudentActivityStatus,
  updateActivitySkills,
  addSkillsToStudent,
  confirmStudentSkills,
  updateActivityPublish,
  updateActivityStatus,
  recalculateAmount,
} from '@/lib/activity';
import { getAllSkills } from '@/lib/skill';
import type {
  Activity,
  ActivityEvaluation,
  Skill,
  StudentActivityWithStudentInfo,
} from '@/types/models';
import {
  CheckCircle,
  XCircle,
  ClipboardList,
  Users,
  Brain,
  FileText,
  Loader2,
  Plus,
  Trash2,
  CalendarClock,
  CalendarCheck2,
  MapPin,
  Users2,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  Settings,
  Save,
  PauseCircle,
} from 'lucide-react';
import {recalculateSkillsFromLogClient} from '@/lib/skill';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
/* -----------------------------------------------------------
 * Local types
 * ---------------------------------------------------------*/

type TabKey = 'info' | 'participants' | 'skills' | 'evaluations';

type EditableSkill = {
  skill_id: string;
  skill_level: number;
  note?: string;
};

/* -----------------------------------------------------------
 * Main component
 * ---------------------------------------------------------*/

export default function ActivityDetailPage() {
  const { activityId } = useParams() as { activityId: string };

  /* ------------------------ UI state ----------------------- */
  const [tab, setTab] = useState<TabKey>('info');
  const [loading, setLoading] = useState(true);
  const [savingSkills, setSavingSkills] = useState(false);
const [reloading, setReloading] = useState(false);
  /* ----------------------- Data state ---------------------- */
  const [activity, setActivity] = useState<Activity | null>(null);
  const [participants, setParticipants] = useState<StudentActivityWithStudentInfo[]>([]);
  const [evaluations, setEvaluations] = useState<ActivityEvaluation[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [editableSkills, setEditableSkills] = useState<EditableSkill[]>([]);

  /* ---------------------- Modal state ---------------------- */
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null);
const [openEvaluations, setOpenEvaluations] = useState<Record<string, boolean>>({});

  /* ------------------------ Derived ------------------------ */
  const pending = participants.filter((p) => p.status === 0);
  const approved = participants.filter((p) => p.status === 1);
  const rejected = participants.filter((p) => p.status === 2);
  const confirmed = approved.filter((p) => p.confirmation_status === 1);
  const completed = participants.filter((p) => p.status === 3);
  const readOnly = !!activity && (activity.is_published || [1, 2, 3].includes(activity.status));
function StatsCard({
  pending, approved, confirmed, completed, rejected,
}: {
  pending: number; approved: number; confirmed: number; completed: number; rejected: number;
}) {
  const totalRequests = pending + approved + rejected;
  return (
    <div className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-3 lg:grid-cols-5">
      <Stat icon={ClipboardList} label="คำขอ" value={totalRequests} />
      <Stat icon={CheckCircle} label="อนุมัติ" value={approved} />
      <Stat icon={Users} label="ยืนยันมา" value={confirmed} />
      <Stat icon={Brain} label="เข้าร่วมจริง" value={completed} />
      <Stat icon={XCircle} label="ปฏิเสธ" value={rejected} />
    </div>
  );
}

function Stat({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={18} className="text-indigo-600" />
      <div className="text-sm">
        {label}:{' '}
        <span className="font-semibold text-gray-800">{value}</span>
      </div>
    </div>
  );
}

  /* -----------------------------------------------------------
   * Fetch all data once activityId is known
   * ---------------------------------------------------------*/
  useEffect(() => {
    if (!activityId) return;

    const load = async () => {
      setLoading(true);
      const [a, p, s, e, skills] = await Promise.all([
        getActivityById(activityId),
        getActivityParticipants(activityId),
        getActivitySkills(activityId),
        getActivityEvaluations(activityId),
        getAllSkills(),
      ]);
      setActivity(a);
      setParticipants(p);
      setEvaluations(e);
      setAllSkills(skills);
      setEditableSkills(
        s.map((sk: any) => ({
          skill_id: String(sk.skill_id ?? sk.id ?? ''),
          skill_level: sk.skill_level ?? 3,
          note: sk.note ?? '',
        })) as EditableSkill[],
      );
      setLoading(false);
    };

    load();
  }, [activityId]);

  /* -----------------------------------------------------------
   * Helper: update participant status
   * ---------------------------------------------------------*/
  const updateStatus = async (studentActivityId: string, status: number, studentId?: string) => {
    await updateStudentActivityStatus(studentActivityId, status);

    if (status === 3 && studentId) {
      await addSkillsToStudent(
        studentId,
        editableSkills.map((s) => ({ skill_id: s.skill_id, skill_level: s.skill_level })),
      );
    }

    const refreshed = await getActivityParticipants(activityId);
    setParticipants(refreshed);

    // ✅ เรียกคำนวณจำนวนผู้เข้าร่วมใหม่ และอัปเดต state
  try {
    const newAmount = await recalculateAmount(activityId);
    setActivity((prev) => prev ? { ...prev, amount: newAmount } : prev);
  } catch (e) {
    console.error('Error recalculating activity amount:', e);
  }
  };
const statusOptions = [
  { value: 0, label: 'เปิดรับสมัคร', icon: <CheckCircle size={16} />, color: 'bg-green-100 text-green-700' },
  { value: 1, label: 'ปิดรับสมัคร', icon: <PauseCircle size={16} />, color: 'bg-yellow-100 text-yellow-700' },
  { value: 2, label: 'ยกเลิก', icon: <XCircle size={16} />, color: 'bg-red-100 text-red-700' },
  { value: 3, label: 'เสร็จสิ้น', icon: <CalendarCheck2 size={16} />, color: 'bg-blue-100 text-blue-700' },
];
  /* -----------------------------------------------------------
   * Helper: save / edit skills for activity
   * ---------------------------------------------------------*/
  const onSkillChange = (idx: number, field: keyof EditableSkill, value: string | number) => {
    setEditableSkills((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const saveSkills = async () => {
    setSavingSkills(true);
    const cleaned = editableSkills.filter((s) => s.skill_id);
    await updateActivitySkills(activityId, cleaned);
    setSavingSkills(false);
    alert('บันทึกทักษะเรียบร้อย');
  };

  /* -----------------------------------------------------------
   * Modal helpers
   * ---------------------------------------------------------*/
  const openSkillModal = (id: string, name: string) => {
    setSelectedStudent({ id, name });
    setModalOpen(true);
  };


function SummaryCard({
  evaluations, participants,
}: {
  evaluations: ActivityEvaluation[]; participants: number;
}) {
  const avg = (key: keyof ActivityEvaluation) =>
    (evaluations.reduce((s, e) => s + Number(e[key] || 0), 0) / evaluations.length).toFixed(1);
  return (
    <div className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-3 lg:grid-cols-6">
      <Score title="คะแนนสถานที่" value={avg('score_venue')} />
      <Score title="ผู้บรรยาย" value={avg('score_speaker')} />
      <Score title="ความน่าสนใจ" value={avg('score_interest')} />
      <Score title="เนื้อหา" value={avg('score_content')} />
      <Score title="การนำไปใช้" value={avg('score_applicability')} />
      <Score title="คะแนนรวม" value={avg('score_overall')} highlight />
      <div className="col-span-full text-xs text-gray-500">
        จำนวนการประเมิน {evaluations.length} ครั้ง • ผู้เข้าร่วมจริง {participants} คน
      </div>
    </div>
  );
}

function Score({ title, value, highlight=false }: {title:string;value:string;highlight?:boolean}) {
  return (
    <div className={`flex flex-col items-center ${highlight && 'font-semibold text-indigo-700'}`}>
      <span className="text-lg">{value}</span>
      <span className="text-xs text-gray-600 text-center">{title}</span>
    </div>
  );
}

  const confirmSkills = async () => {
    if (!selectedStudent) return;
    await confirmStudentSkills(
      selectedStudent.id,
      activityId,
      editableSkills.map((s) => ({
        skill_id: s.skill_id,
        level: s.skill_level,
        note: s.note ?? '',
      })),
    );
    await recalculateSkillsFromLogClient(selectedStudent.id);
    alert('ยืนยันทักษะให้นักศึกษาแล้ว');
    setModalOpen(false);
  };

  /* -----------------------------------------------------------
   * Render helpers
   * ---------------------------------------------------------*/
  const ThaiDate = (d?: string | null) => (d ? new Date(d).toLocaleDateString('th-TH') : '-');

  const confirmOpenDate = () => {
    if (!activity?.event_date) return '-';
    const event = new Date(activity.event_date);
    event.setDate(event.getDate() - (activity.confirmation_days_before_event ?? 3));
    return event.toLocaleDateString('th-TH');
  };

  if (loading || !activity) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-gray-500">
        <Loader2 className="animate-spin" />
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      {/* Header */}
<header className="flex flex-col gap-2 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-gray-800">{activity.name}</h1>
    <p className="text-gray-600">{activity.description}</p>
  </div>

  {/* badges */}
  <div className="flex flex-wrap gap-2">
    {/* status */}
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        {
          0: 'bg-green-100 text-green-800',
          1: 'bg-yellow-100 text-yellow-800',
          2: 'bg-red-100 text-red-800',
          3: 'bg-gray-200 text-gray-700',
        }[activity.status]
      }`}
    >
      {{
        0: 'เปิดรับสมัคร',
        1: 'ปิดรับสมัคร',
        2: 'ยกเลิก',
        3: 'เสร็จสิ้น',
      }[activity.status]}
    </span>

    {/* publish */}
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        activity.is_published ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
      }`}
    >
      {activity.is_published ? 'Published' : 'Unpublished'}
    </span>

    {/* edit button */}
    <Link
      href={`/staff/activity/edit/${activity.id}`}
      className="rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white shadow hover:bg-indigo-700"
    >
      แก้ไขรายละเอียด
    </Link>
  </div>
</header>


      {/* Tabs */}
      <nav className="flex gap-3 overflow-x-auto pb-2">
        {[
          { key: 'info', label: 'ข้อมูลทั่วไป', Icon: ClipboardList },
          { key: 'participants', label: 'ผู้เข้าร่วม', Icon: Users },
          { key: 'skills', label: 'ทักษะ', Icon: Brain },
          { key: 'evaluations', label: 'การประเมิน', Icon: FileText },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as TabKey)}
            className={`inline-flex items-center gap-1 rounded-t-2xl border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === key
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </nav>

      {/* ---------------------------------------------------------------- */}
      {/* Tab content                                                     */}
      {/* ---------------------------------------------------------------- */}

      {/* ---------- INFO TAB ---------- */}
      {tab === 'info' && (
<section className="rounded-xl bg-white p-6 shadow-sm space-y-8">
  {/* 🧾 หมวด: ข้อมูลทั่วไป */}
  <div className="space-y-4">
    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
      <FileText size={18} /> ข้อมูลกิจกรรม
    </h2>

    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-sm text-gray-700">
      <li className="flex items-start gap-2">
        <FileText size={16} className="mt-1 text-gray-500" />
        รายละเอียด: {activity.details || '—'}
      </li>
      <li className="flex items-start gap-2">
        <CalendarCheck2 size={16} className="mt-1 text-gray-500" />
        วันที่จัด: {ThaiDate(activity.event_date)}
      </li>
      <li className="flex items-start gap-2">
        <CalendarClock size={16} className="mt-1 text-gray-500" />
        ปิดรับสมัคร: {ThaiDate(activity.registration_deadline)}
      </li>
      <li className="flex items-start gap-2">
        <Users2 size={16} className="mt-1 text-gray-500" />
        จำนวนที่รับ: {activity.max_amount} คน
      </li>
      <li className="flex items-start gap-2">
        <MapPin size={16} className="mt-1 text-gray-500" />
        สถานที่: {activity.location || '—'}
      </li>
      <li className="flex items-start gap-2">
        <CheckCircle2 size={16} className="mt-1 text-gray-500" />
        เปิดยืนยันได้ตั้งแต่: {confirmOpenDate()}
      </li>
    </ul>
  </div>

  {/* ⚙️ หมวด: การตั้งค่า */}
  <div className="space-y-4">
    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
      <Settings size={18} /> การตั้งค่า
    </h2>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* ยืนยันล่วงหน้า */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-700 whitespace-nowrap">ยืนยันล่วงหน้า:</label>
        <input
          type="number"
          min={0}
          className="w-24 rounded border px-3 py-1 text-sm"
          value={activity.confirmation_days_before_event}
          onChange={(e) =>
            setActivity({
              ...activity,
              confirmation_days_before_event: Number(e.target.value),
            })
          }
        />
        <span className="text-sm text-gray-500">วัน</span>
      </div>

      {/* toggle publish */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">เผยแพร่:</span>
        <button
          onClick={() =>
            setActivity({ ...activity, is_published: !activity.is_published })
          }
          className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${
            activity.is_published
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          {activity.is_published ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
          {activity.is_published ? 'เผยแพร่แล้ว' : 'ยังไม่เผยแพร่'}
        </button>
      </div>

      {/* radio status */
      }
<div className="flex flex-col gap-2">
  <span className="text-sm font-medium text-gray-700">สถานะกิจกรรม:</span>
  <div className="flex flex-wrap gap-2">
    {statusOptions.map((opt) => {
      const isSelected = activity.status === opt.value;
      return (
        <button
          key={opt.value}
          onClick={() => setActivity({ ...activity, status: opt.value })}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium border transition
            ${
              isSelected
                ? `${opt.color} border-transparent shadow-sm`
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
        >
          {opt.icon} {opt.label}
        </button>
      );
    })}
  </div>
</div>

    </div>

    {/* ปุ่มบันทึก */}
    <div className="pt-2">
      <button
        onClick={async () => {
          await Promise.all([
            fetch(`/activity/${activity.id}/confirm-days`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ days: activity.confirmation_days_before_event }),
            }),
            updateActivityPublish(activity.id, activity.is_published),
            updateActivityStatus(activity.id, activity.status),
          ]);
          alert('บันทึกแล้ว');
        }}
        className="inline-flex items-center gap-1 rounded bg-blue-600 px-4 py-2 text-sm text-white shadow hover:bg-blue-700"
      >
        <Save size={16} /> บันทึกการเปลี่ยนแปลง
      </button>
    </div>
  </div>
</section>

      )}

      {/* ---------- PARTICIPANTS TAB ---------- */}
      {tab === 'participants' && (
  <section className="space-y-6">
    {/* 🔁 ปุ่มรีโหลด */}
    <div className="flex justify-between items-center">
      <StatsCard
        pending={pending.length}
        approved={approved.length}
        confirmed={confirmed.length}
        completed={completed.length}
        rejected={rejected.length}
      />
<button
  onClick={async () => {
    setReloading(true);
    const refreshed = await getActivityParticipants(activityId);
    setParticipants(refreshed);
    setReloading(false);
  }}
  disabled={reloading}
  className="inline-flex items-center gap-1 rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300 disabled:opacity-60"
>
  {reloading && <Loader2 size={14} className="animate-spin text-gray-500" />}
  {!reloading && <Loader2 size={14} className="text-gray-500" />} {/* optional */}
  โหลดใหม่
</button>

    </div>

          <ParticipantList
            title="📥 คำขอเข้าร่วม"
            items={pending}
            empty="ไม่มีคำขอ"
            renderActions={(p) => (
              <div className="flex gap-2">
                <ActionButton
                  onClick={() => updateStatus(p.id, 1)}
                  variant="success"
                  label="อนุมัติ"
                  Icon={CheckCircle}
                />
                <ActionButton
                  onClick={() => updateStatus(p.id, 2)}
                  variant="danger"
                  label="ปฏิเสธ"
                  Icon={XCircle}
                />
              </div>
            )}
          />

          <ParticipantList
            title="✅ ผู้ได้รับอนุมัติ"
            items={approved}
            empty="ไม่มีผู้ได้รับอนุมัติ"
            renderActions={(p) => (
              <div className="text-sm text-gray-500">
                ยืนยันเข้าร่วม:{' '}
                {{ 0: 'ยังไม่ตอบ', 1: 'ยืนยันแล้ว', 2: 'ยกเลิก' }[p.confirmation_status]}
              </div>
            )}
          />

          <ParticipantList
            title="🛎️ ยืนยันเข้าร่วมกิจกรรมแล้ว"
            items={confirmed}
            empty="ยังไม่มีผู้ยืนยัน"
            renderActions={(p) =>
              p.evaluation_status === 1 ? (
                <span className="text-sm text-green-600">✅ ยืนยันทักษะแล้ว</span>
              ) : (
                <button
                  onClick={() => openSkillModal(p.student_id, p.full_name)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  📝 ยืนยันทักษะ
                </button>
              )
            }
          />

          <ParticipantList
            title="🎉 ผู้ที่เข้าร่วมกิจกรรมเรียบร้อยแล้ว"
            items={completed}
            variant="success"
            empty="ยังไม่มีผู้เข้าร่วมกิจกรรมที่เสร็จสิ้น"
          />

          <ParticipantList
            title="❌ ผู้ถูกปฏิเสธ"
            items={rejected}
            variant="danger"
            empty="ไม่มีผู้ถูกปฏิเสธ"
          />
        </section>
      )}

      {/* ---------- SKILLS TAB ---------- */}
      {tab === 'skills' && (
<section className="space-y-4">
  {editableSkills.map((s, idx) => (
    <div
      key={idx}
      className="flex flex-col gap-3 rounded-xl bg-gray-50 px-4 py-4 sm:flex-row sm:items-center"
    >
      <select
        disabled={readOnly}
        value={s.skill_id}
        onChange={(e) => onSkillChange(idx, 'skill_id', e.target.value)}
        className="flex-1 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:text-gray-500"
      >
        <option value="">-- เลือกทักษะ --</option>
        {allSkills
          .filter(
            (sk) =>
              !editableSkills.some(
                (es) => es.skill_id === sk.id && es.skill_id !== s.skill_id
              )
          )
          .map((sk) => (
            <option key={sk.id} value={sk.id}>
              {sk.name_th} ({sk.skill_type})
            </option>
          ))}
      </select>

      <select
        disabled={readOnly}
        value={s.skill_level}
        onChange={(e) => onSkillChange(idx, 'skill_level', Number(e.target.value))}
        className="bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:text-gray-500"
      >
        {[1, 2, 3, 4, 5].map((lv) => (
          <option key={lv} value={lv}>
            ระดับ {lv}
          </option>
        ))}
      </select>

      <input
        disabled={readOnly}
        type="text"
        placeholder="บันทึกเพิ่มเติม"
        value={s.note || ''}
        onChange={(e) => onSkillChange(idx, 'note', e.target.value)}
        className="flex-1 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 disabled:text-gray-500"
      />

      <button
        disabled={readOnly}
        onClick={() => setEditableSkills(editableSkills.filter((_, i) => i !== idx))}
        className="text-sm text-red-600 hover:underline disabled:text-gray-400"
      >
        <Trash2 size={14} className="inline-block mr-1" /> ลบ
      </button>
    </div>
  ))}

  {/* Add & Save Buttons */}
  {!readOnly && (
    <div className="flex justify-between pt-4">
      <button
        onClick={() => setEditableSkills([...editableSkills, { skill_id: '', skill_level: 3 }])}
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
      >
        <Plus size={14} /> เพิ่มทักษะ
      </button>

      <button
        onClick={saveSkills}
        disabled={savingSkills}
        className="inline-flex items-center gap-1 rounded bg-blue-600 px-4 py-1 text-sm text-white shadow hover:bg-blue-700 disabled:opacity-50"
      >
        {savingSkills && <Loader2 size={14} className="animate-spin" />} <Save size={14} /> บันทึกทักษะ
      </button>
    </div>
  )}
</section>

      )}

      {/* ---------- EVALUATIONS TAB ---------- */}
      {tab === 'evaluations' && (
        
        <section className="space-y-4">
          {evaluations.length === 0 && (
            <div className="rounded-2xl bg-gray-50 p-6 text-center text-sm text-gray-500 shadow-sm">
              ยังไม่มีการประเมิน
            </div>
          )}
            {evaluations.length > 0 && (
              <SummaryCard evaluations={evaluations} participants={completed.length} />
            )}

{evaluations.map((e) => {
  const isOpen = openEvaluations[e.id] || false;
  return (
    <div key={e.id} className="rounded-2xl bg-white shadow-sm">
      <button
        onClick={() =>
          setOpenEvaluations((prev) => ({
            ...prev,
            [e.id]: !isOpen,
          }))
        }
        className="flex w-full items-center justify-between border-b px-6 py-4 text-left text-sm hover:bg-gray-50"
      >
        <span className="text-gray-800 font-medium">
          {e.is_anonymous ? 'ไม่เปิดเผยชื่อ' : 'นักศึกษา'}
        </span>
        <span className="flex items-center gap-2 text-gray-600">
          คะแนนรวม: <b>{e.score_overall} / 5</b>
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      </button>

      {isOpen && (
        <div className="grid grid-cols-2 gap-4 p-6 text-sm text-gray-700 border-t">
          <Info label="คะแนนสถานที่" value={e.score_venue} />
          <Info label="ผู้บรรยาย" value={e.score_speaker} />
          <Info label="ความน่าสนใจ" value={e.score_interest} />
          <Info label="เนื้อหา" value={e.score_content} />
          <Info label="การนำไปใช้" value={e.score_applicability} />
          <Info label="คะแนนรวม" value={e.score_overall} />
          <div className="col-span-2">
            <p className="text-gray-600">ความคิดเห็น:</p>
            <p className="rounded bg-gray-100 p-2">{e.comment || '-'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-600">ข้อเสนอแนะเพิ่มเติม:</p>
            <p className="rounded bg-gray-100 p-2">{e.suggestions || '-'}</p>
          </div>
        </div>
      )}
    </div>
  );
})}

        </section>
      )}

      {/* ---------- SKILL CONFIRM MODAL ---------- */}
      {modalOpen && selectedStudent && (
        <Modal onClose={() => setModalOpen(false)}>
          <h2 className="mb-4 text-lg font-bold text-gray-800">ยืนยันทักษะให้กับ {selectedStudent.name}</h2>

          <div className="space-y-4 max-h-[60vh] overflow-auto pr-2">
            {editableSkills.map((s, idx) => (
              <div key={idx} className="space-y-2 rounded bg-gray-50 p-4 text-sm">
                <div className="flex items-center justify-between">
                  <b>{allSkills.find((a) => a.id === s.skill_id)?.name_th || '-'}</b>
                  <button
                    onClick={() => setEditableSkills(editableSkills.filter((_, i) => i !== idx))}
                    className="text-xs text-red-600 hover:underline"
                  >
                    ลบทักษะ
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-gray-600">ระดับ:</label>
                  <select
                    value={s.skill_level}
                    onChange={(e) => onSkillChange(idx, 'skill_level', Number(e.target.value))}
                    className="rounded border px-2 py-1 text-xs"
                  >
                    {[1, 2, 3, 4, 5].map((lv) => (
                      <option key={lv} value={lv}>
                        ระดับ {lv}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-600 text-xs">หมายเหตุ:</label>
                  <input
                    type="text"
                    value={s.note || ''}
                    onChange={(e) => onSkillChange(idx, 'note', e.target.value)}
                    className="w-full rounded border px-2 py-1 text-xs"
                    placeholder="เช่น ความเห็นเพิ่มเติมเกี่ยวกับทักษะนี้"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-2 text-sm">
            <button onClick={() => setModalOpen(false)} className="text-gray-600 hover:underline">
              ยกเลิก
            </button>
            <button
              onClick={confirmSkills}
              className="inline-flex items-center gap-1 rounded bg-blue-600 px-4 py-1 text-white shadow hover:bg-blue-700"
            >
              <CheckCircle size={16} /> ยืนยัน
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* -----------------------------------------------------------
 * Sub‑components
 * ---------------------------------------------------------*/

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-1 text-sm">
      <p className="text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}

function StatsCard({ approved, confirmed }: { approved: number; confirmed: number }) {
  return (
    <div className="rounded-2xl bg-white p-6 text-sm shadow-sm">
      ✅ อนุมัติแล้ว: <b>{approved}</b> คน | 🛎️ ยืนยันแล้ว: <b>{confirmed}</b> คน
    </div>
  );
}

interface ParticipantListProps {
  title: string;
  items: StudentActivityWithStudentInfo[];
  empty: string;
  variant?: 'success' | 'danger';
  renderActions?: (p: StudentActivityWithStudentInfo) => React.ReactNode;
}

function ParticipantList({ title, items, empty, variant, renderActions }: ParticipantListProps) {
  const variantClass =
    variant === 'success'
      ? 'bg-green-50 text-green-800 border-green-200'
      : variant === 'danger'
      ? 'bg-red-50 text-red-700 border-red-200'
      : 'bg-white text-gray-800 border-gray-200';

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        {title.includes('คำขอ') && <ClipboardList size={16} />}
        {title.includes('ได้รับอนุมัติ') && <CheckCircle size={16} />}
        {title.includes('ยืนยันเข้าร่วม') && <CalendarCheck2 size={16} />}
        {title.includes('เข้าร่วมกิจกรรมเรียบร้อย') && <Brain size={16} />}
        {title.includes('ถูกปฏิเสธ') && <XCircle size={16} />}
        <span>{title.replace(/[🛎️✅📥🎉❌]/g, '').trim()}</span>
      </h3>

      {items.length === 0 && (
        <p className="text-sm text-gray-500 italic">{empty}</p>
      )}

      {items.length > 0 && (
        <div className="overflow-x-auto">
          <table className={`w-full table-auto border text-sm rounded-lg overflow-hidden ${variantClass}`}>
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600">
                <th className="px-4 py-2 font-medium">ชื่อ</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">รหัสนักศึกษา</th>
                <th className="px-4 py-2 font-medium text-center">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-800">{p.full_name}</td>
                  <td className="px-4 py-2 text-gray-700 whitespace-nowrap">{p.student_code}</td>
                  <td className="px-4 py-2 text-center">
                    {renderActions && renderActions(p)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  variant: 'success' | 'danger';
  Icon: typeof CheckCircle;
}

function ActionButton({ onClick, label, variant, Icon }: ActionButtonProps) {
  const color = variant === 'success' ? 'text-green-600' : 'text-red-600';
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1 ${color} text-sm`}>
      <Icon size={14} /> {label}
    </button>
  );
}

function Modal({ onClose, children }: PropsWithChildren<{ onClose: () => void }>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="ปิด"
        >
          <XCircle size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: number }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value ?? '-'}</p>
    </div>
  );
}
