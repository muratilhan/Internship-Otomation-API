import prisma from "../../db";

export const getHolidays = async (req, res, next) => {
  try {
    const holidays = await prisma.holidays.findMany();

    res.status(200).json({ data: holidays });
  } catch (error) {
    next(error);
  }
};

export const addHoliday = async (req, res, next) => {
  try {
    const { date, desc } = req.body;

    const holiday = await prisma.holidays.create({
      data: {
        date: new Date(date),
        desc: desc,
      },
    });
    res.status(200).json({ message: "holiday created succesfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteHoliday = async (req, res, next) => {
  try {
    const { holidayId } = req.params;

    const deletedHoliday = await prisma.holidays.delete({
      where: {
        id: holidayId * 1,
      },
    });

    if (!deletedHoliday) {
      return res.status(404).json({ message: "oops" });
    }

    return res.status(200).json({ message: "succesfully deleted" });
  } catch (error) {
    next(error);
  }
};
