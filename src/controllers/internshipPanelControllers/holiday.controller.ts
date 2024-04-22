import prisma from "../../db";

export const getHolidays = async (req, res, next) => {
  try {
    const holidays = await prisma.holidays.findMany();

    res.status(200).json({ data: holidays });
  } catch (error) {
    next(error);
  }
};
