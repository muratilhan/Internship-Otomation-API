// TODO: calculate JS Dates between 2 dates except holidays and return totalDay

function isWeekend(date, isStudentWorkOnSaturday) {
  const day = date.getDay();
  if (isStudentWorkOnSaturday) {
    return day === 0; // sadece Pazar
  } else {
    return day === 0 || day === 6; // Pazar (0) veya Cumartesi (6) ise true döndür
  }
}

function isHoliday(date, holidays) {
  // Tatil günleri listesi, ihtiyacınıza göre güncelleyebilirsiniz
  return holidays.some((holiday) => holiday.getTime() === date.getTime());
}

export const calculateBussinesDates = (
  startDate,
  endDate,
  holidays,
  isStudentWorkOnSaturday
) => {
  let count = 0;

  const currentDate = new Date(startDate);
  const finalDate = new Date(endDate);
  while (currentDate <= finalDate) {
    if (
      !isWeekend(currentDate, isStudentWorkOnSaturday) &&
      !isHoliday(currentDate, holidays)
    ) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return count;
};
