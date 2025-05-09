// lib/utils/date.ts
export function formatDateThai(isoDate: string): string {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }
  