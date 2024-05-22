function calculateWeeklyWork(date, weekDayWork) {
  const day = date.getDay();
  const weeklyWork = weekDayWork || [];
  return weeklyWork.includes(day);
}

export function isHoliday(date, holidays) {
  // Tatil günleri listesi, ihtiyacınıza göre güncelleyebilirsiniz
  return holidays.some(
    (holiday) => new Date(holiday).getTime() === new Date(date).getTime()
  );
}

export const calculateBussinesDates = (
  startDate,
  endDate,
  holidays,
  weekDayWork
) => {
  let count = 0;

  const currentDate = new Date(startDate);
  const finalDate = new Date(endDate);
  while (currentDate <= finalDate) {
    if (
      calculateWeeklyWork(currentDate, weekDayWork) &&
      !isHoliday(currentDate, holidays) &&
      !isOfficialHoliday(currentDate)
    ) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
};

export const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0"); // Gün (iki haneli olacak şekilde)
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ay (1 ay eklemeliyiz çünkü ay sıfırdan başlar)
  const year = date.getFullYear(); // Yıl

  return `${day}.${month}.${year}`;
};

export const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isOfficialHoliday = (date) => {
  const disabledDates = [
    { month: 0, day: 1 }, // 1 Ocak (Ocak ayı 0-indexli olarak 0'dır)
    { month: 3, day: 23 }, // 23 Nisan (Nisan ayı 0-indexli olarak 3'tür)
    { month: 4, day: 1 }, // 1 Mayıs (Mayıs ayı 0-indexli olarak 4'tür)
    { month: 4, day: 19 }, // 19 Mayıs (Mayıs ayı 0-indexli olarak 4'tür)
    { month: 6, day: 15 }, // 15 Temmuz (Temmuz ayı 0-indexli olarak 6'dır)
    { month: 7, day: 30 }, // 30 Ağustos (Ağustos ayı 0-indexli olarak 7'dir)
    { month: 9, day: 29 }, // 29 Ekim (Ekim ayı 0-indexli olarak 9'dur)
  ];

  // Date objesinden ay ve gün bilgilerini al
  const month = date.getMonth();
  const day = date.getDate();

  // Ay ve gün bilgilerini kontrol et
  return disabledDates.some((d) => day === d.day && month === d.month);
};
