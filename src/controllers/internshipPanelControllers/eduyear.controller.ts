import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { BadRequestError } from "../../errors/BadRequestError";

export const getEduYears = async (req, res, next) => {
  try {
    const eduYears = await prisma.eduYear.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    res.status(200).json({ data: eduYears });
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
    res.status(200).json({ message: "eduYear succesfully added" });
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

    // const deletedEduYear = await prisma.eduYear.delete({
    //   where: {
    //     id: eduYearId * 1,
    //   },
    // });

    // if (!deletedEduYear) {
    //   return res.status(404).json({ message: "oops" });
    // }

    // await prisma.internForm.updateMany({
    //   where: {
    //     edu_year_id: eduYearId * 1,
    //   },
    //   data: {
    //     edu_year_id: null,
    //   },
    // });

    return res.status(200).json({ message: "succesfully deleted" });
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

    res.status(200).json({ data: modifiedEduYears });
  } catch (error) {
    next(error);
  }
};
