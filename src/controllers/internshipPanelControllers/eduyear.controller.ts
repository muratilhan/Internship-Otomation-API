import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import resultCodes from "../../enums/resultCodes";
import { BadRequestError } from "../../errors/BadRequestError";

export const getEduYears = async (req, res, next) => {
  try {
    const eduYears = await prisma.eduYear.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return res.status(200).json({ data: eduYears });
  } catch (error) {
    next(error);
  }
};

export const addEduYear = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newEduYear = await prisma.eduYear.create({
      data: {
        name: name,
      },
    });
    return res.status(200).json({ message: resultCodes.CREATE_SUCCESS });
  } catch (error) {
    next(error);
  }
};

export const deleteEduYear = async (req, res, next) => {
  try {
    const { eduYearId } = req.params;

    await prisma.$transaction(async (prisma) => {
      // EduYear'ı sil

      // EduYear'a bağlı olan formları ilişkilerini kes
      await prisma.internForm.updateMany({
        where: {
          edu_year: {
            id: eduYearId * 1,
          },
        },
        data: {
          edu_year_id: null,
        },
      });

      const deletedEduYear = await prisma.eduYear.delete({
        where: {
          id: eduYearId * 1,
        },
      });

      if (!deletedEduYear) {
        throw new BadRequestError(errorCodes.NOT_FOUND);
      }
    });

    return res.status(200).json({ message: resultCodes.DELETE_SUCCES });
  } catch (error) {
    next(error);
  }
};

export const getEduYearsAC = async (req, res, next) => {
  try {
    const eduYears = await prisma.eduYear.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const modifiedEduYears = eduYears.map((eduYear) => ({
      id: eduYear.id,
      label: eduYear.name,
      subtext: "",
    }));

    return res.status(200).json({ data: modifiedEduYears });
  } catch (error) {
    next(error);
  }
};
