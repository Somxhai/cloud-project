// lib/utils/date.ts
export function formatDateThai(isoDate: string): string {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }
  

  export function formatDateThaiA(isoDate: string): string {
  const date = new Date(isoDate);

  // ตรวจว่าปีใน date น้อยกว่า 2400 แสดงว่าเป็นปี ค.ศ. (คาดว่า input เป็นรูปแบบ ISO ที่ถูกต้อง)
  const year = date.getFullYear();
  const buddhistYear = year < 2400 ? year + 543 : year;

  // สร้างวันที่แบบไทยด้วยมือ
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
  ];

  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];

  return `${day} ${month} ${buddhistYear}`;
}
