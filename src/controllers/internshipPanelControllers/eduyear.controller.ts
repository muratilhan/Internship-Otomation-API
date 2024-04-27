import prisma from "../../db";

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
  } catch (error) {
    next(error);
  }
};

export const deleteEduYear = async (req, res, next) => {
  try {
    const { eduYearId } = req.params;

    const deletedEduYear = await prisma.eduYear.delete({
      where: eduYearId,
    });

    if (deletedEduYear) {
      return res.status(200).json({ message: "succesfully deleted" });
    }

    res.status(204);
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
