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
      where: {
        student_id: {
          equals: userId,
        },
      },
      orderBy: [{ createdAt: "desc" }],
      select: {
        id: true,
        status: true,
        form: {
          select: {
            start_date: true,
            end_date: true,
            edu_year: true,
            company_info: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ data: activeInternship });
    // return last not completed created internStatus
  } catch (error) {
    next(error);
  }
};
