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

export const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0"); // Gün (iki haneli olacak şekilde)
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ay (1 ay eklemeliyiz çünkü ay sıfırdan başlar)
  const year = date.getFullYear(); // Yıl

  return `${day}.${month}.${year}`;
};
