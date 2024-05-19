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
      !isHoliday(currentDate, holidays)
    ) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log("count", count);
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
