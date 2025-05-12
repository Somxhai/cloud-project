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
  Save,
  Plus,
  Trash2,
} from 'lucide-react';

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

  /* ----------------------- Data state ---------------------- */
  const [activity, setActivity] = useState<Activity | null>(null);
  const [participants, setParticipants] = useState<StudentActivityWithStudentInfo[]>([]);
  const [evaluations, setEvaluations] = useState<ActivityEvaluation[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [editableSkills, setEditableSkills] = useState<EditableSkill[]>([]);

  /* ---------------------- Modal state ---------------------- */
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null);

  /* ------------------------ Derived ------------------------ */
  const pending = participants.filter((p) => p.status === 0);
  const approved = participants.filter((p) => p.status === 1);
  const rejected = participants.filter((p) => p.status === 2);
  const confirmed = approved.filter((p) => p.confirmation_status === 1);
  const completed = participants.filter((p) => p.status === 3);

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
  };

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
      <header className="space-y-2 rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">{activity.name}</h1>
        <p className="text-gray-600">{activity.description}</p>
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
        <section className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2 lg:grid-cols-3">
          <InfoRow label="รายละเอียด" value={activity.details || '-'} />
          <InfoRow label="วันที่จัด" value={ThaiDate(activity.event_date)} />
          <InfoRow label="วันปิดรับสมัคร" value={ThaiDate(activity.registration_deadline)} />
          <InfoRow label="จำนวนที่รับ" value={activity.max_amount} />
          <InfoRow label="สถานที่" value={activity.location || '-'} />
          <InfoRow
            label="สถานะ"
            value={{ 0: 'เปิดรับ', 1: 'ปิดรับ', 2: 'ยกเลิก', 3: 'เสร็จสิ้น' }[activity.status] || '-'}
          />
          <InfoRow label="เผยแพร่" value={activity.is_published ? 'ใช่' : 'ไม่ใช่'} />
          <InfoRow label="ยืนยันล่วงหน้า" value={`${activity.confirmation_days_before_event} วัน`} />
          <InfoRow label="เปิดยืนยันตั้งแต่" value={confirmOpenDate()} />

          {/* Edit confirm days */}
          <div className="col-span-full flex items-end gap-2 pt-2">
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
            <button
              onClick={async () => {
                await fetch(`/activity/${activity.id}/confirm-days`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ days: activity.confirmation_days_before_event }),
                });
                alert('บันทึกแล้ว');
              }}
              className="inline-flex items-center gap-1 rounded bg-blue-600 px-4 py-1 text-sm text-white shadow hover:bg-blue-700"
            >
              <Save size={14} /> บันทึก
            </button>
          </div>
        </section>
      )}

      {/* ---------- PARTICIPANTS TAB ---------- */}
      {tab === 'participants' && (
        <section className="space-y-6">
          <StatsCard approved={approved.length} confirmed={confirmed.length} />

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
              className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center"
            >
              <select
                value={s.skill_id}
                onChange={(e) => onSkillChange(idx, 'skill_id', e.target.value)}
                className="flex-1 rounded border px-3 py-2 text-sm"
              >
                <option value="">-- เลือกทักษะ --</option>
                {allSkills.map((sk) => (
                  <option key={sk.id} value={sk.id}>
                    {sk.name_th} ({sk.skill_type})
                  </option>
                ))}
              </select>

              <select
                value={s.skill_level}
                onChange={(e) => onSkillChange(idx, 'skill_level', Number(e.target.value))}
                className="rounded border px-3 py-2 text-sm"
              >
                {[1, 2, 3, 4, 5].map((lv) => (
                  <option key={lv} value={lv}>
                    ระดับ {lv}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="บันทึกเพิ่มเติม"
                value={s.note || ''}
                onChange={(e) => onSkillChange(idx, 'note', e.target.value)}
                className="flex-1 rounded border px-3 py-2 text-sm"
              />

              <button
                onClick={() => setEditableSkills(editableSkills.filter((_, i) => i !== idx))}
                className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline"
              >
                <Trash2 size={14} /> ลบ
              </button>
            </div>
          ))}

          {/* Add & Save */}
          <div className="flex justify-between pt-2">
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
          {evaluations.map((e) => (
            <div key={e.id} className="space-y-2 rounded-2xl bg-white p-6 shadow-sm">
              <div className="text-lg font-medium text-gray-800">คะแนนรวม {e.score_overall} / 5</div>
              <div className="text-sm text-gray-500">
                สถานที่: {e.score_venue} | วิทยากร: {e.score_speaker} | ความน่าสนใจ: {e.score_interest}
              </div>
              <p className="text-sm text-gray-700">
                <b>ความคิดเห็น:</b> {e.comment || '-'}
              </p>
            </div>
          ))}
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
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {items.length === 0 && <p className="text-sm text-gray-500">{empty}</p>}
      {items.map((p) => (
        <div key={p.id} className={`flex justify-between rounded border p-3 ${variantClass}`}>
          <div>
            {p.full_name} ({p.student_code})
          </div>
          {renderActions && <div>{renderActions(p)}</div>}
        </div>
      ))}
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
