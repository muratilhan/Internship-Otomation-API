import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import resultCodes from "../../enums/resultCodes";
import { BadRequestError } from "../../errors/BadRequestError";

export const getHolidays = async (req, res, next) => {
  try {
    const holidays = await prisma.holidays.findMany();

    return res.status(200).json({ data: holidays });
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
    return res.status(200).json({ message: resultCodes.CREATE_SUCCESS });
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
      throw new BadRequestError(errorCodes.NOT_FOUND);
    }

    return res.status(200).json({ message: resultCodes.DELETE_SUCCES });
  } catch (error) {
    next(error);
  }
};
