import { Loader2 } from 'lucide-react';

export default function Loading({ full = false }: { full?: boolean }) {
  const containerClass = full
    ? 'min-h-screen flex items-center justify-center'
    : 'flex h-[60vh] items-center justify-center';

  return (
    <div className={`${containerClass} flex-col space-y-4 text-gray-700`}>
      {/* Spinner ใหญ่ขึ้น */}
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />

      {/* ข้อความเด่นขึ้น */}
      <p className="text-lg font-medium tracking-wide">กำลังโหลดข้อมูล…</p>
    </div>
  );
}
