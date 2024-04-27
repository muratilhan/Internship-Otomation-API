export const createFilter = ({
  comissionId,
  startDate,
  endDate,
  isSealed,
  studentId,
}) => {
  return {
    OR: [
      studentId
        ? {
            student: {
              id: {
                contains: studentId,
              },
            },
          }
        : {},
      comissionId
        ? { interview: { comission: { id: { contains: comissionId } } } }
        : {},
      startDate ? { start_date: { gte: new Date(startDate) } } : {},
      endDate ? { end_date: { lte: new Date(endDate) } } : {},
      isSealed !== undefined ? { isSealed: isSealed === "true" } : {},
    ],
  };
};
