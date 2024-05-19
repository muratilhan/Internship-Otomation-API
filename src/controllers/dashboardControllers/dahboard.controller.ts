import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { AuthenticationError } from "../../errors/AuthenticationError";

export const getInterviewsCount = async (req, res, next) => {
  try {
    const userId = req.id;

    const totalInterviewReleatedTo = await prisma.interview.count({
      where: {
        comission_id: {
          equals: userId,
        },
      },
    });

    return res.status(200).json({ data: totalInterviewReleatedTo || 0 });
  } catch (error) {
    next(error);
  }
};

export const getFormsCount = async (req, res, next) => {
  try {
    const userId = req.id;

    const totalFormsReleatedTo = await prisma.internForm.count({
      where: {
        follow_up_id: {
          equals: userId,
        },
      },
    });

    return res.status(200).json({ data: totalFormsReleatedTo || 0 });
  } catch (error) {
    next(error);
  }
};

export const getStudentActiveInternship = async (req, res, next) => {
  try {
    const userId = req.id;
    const activeInternship = await prisma.internStatus.findFirst({
      select: {
        id: true,
        status: true,
      },
      where: {
        student_id: {
          equals: userId,
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return res.status(200).json({ data: activeInternship });
    // return last not completed created internStatus
  } catch (error) {
    next(error);
  }
};
