// TODO: calculate JS Dates between 2 dates except holidays and return totalDay

function calculateWeeklyWork(date, weekDayWork) {
  const day = date.getDay();
  const weeklyWork = weekDayWork || [];
  return weeklyWork.includes(day);
}

function isHoliday(date, holidays) {
  // Tatil günleri listesi, ihtiyacınıza göre güncelleyebilirsiniz
  return holidays.some((holiday) => holiday.getTime() === date.getTime());
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
