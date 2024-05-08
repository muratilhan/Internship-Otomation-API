import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import InternStatus from "../../enums/internStatus";
import { BadRequestError } from "../../errors/BadRequestError";

// TODO: internShip panel services
function createManyInterviewAdapter(interview, userId) {
  const { date, comissionId, internStatusId, student_id } = interview;
  return {
    createdBy: {
      connect: {
        id: userId,
      },
    },

    date: new Date(date),

    internStatus: {
      connect: {
        id: internStatusId,
      },
    },
    student: {
      connect: {
        id: student_id,
      },
    },

    comission: {
      connect: {
        id: comissionId,
      },
    },
  };
}

export const startInterviews = async (req, res, next) => {
  try {
    const userId = req.id;

    const interviews = req.body.interviews;

    // const { date, comissionId, internStatusId } = interviews;

    console.log("egeA", interviews);

    for (let index = 0; index < interviews.length; index++) {
      const internStatus = await prisma.internStatus.findUnique({
        where: { id: interviews[index].internStatusId },
      });

      if (!internStatus) {
        throw new BadRequestError(errorCodes.NOT_FOUND);
      }

      if (internStatus.interview_id) {
        throw new BadRequestError(errorCodes.INV_DUPLICATE);
      }

      interviews[index] = {
        ...interviews[index],
        student_id: internStatus.student_id,
      };

      const interviewCreate = createManyInterviewAdapter(
        interviews[index],
        userId
      );

      await prisma.interview.create({
        data: interviewCreate,
      });

      await prisma.internStatus.update({
        where: { id: interviews[index].internStatusId },
        data: {
          status: InternStatus.MLK01,
        },
      });
    }

    return res.status(200).json({ message: "interviews added succesfully" });
  } catch (error) {
    next(error);
  }
};

export const getConfidentalMailList = async (req, res, next) => {
  try {
    const confidentalReports = prisma.confidentalReport.findMany({
      where: {
        isMailSended: true,
      },
    });

    return res.status(200).json({ data: confidentalReports });
  } catch (error) {
    next(error);
  }
};

export const getInterviewReady = async (req, res, next) => {
  try {
    const internStatuses = await prisma.internStatus.findMany({
      where: {
        status: InternStatus.FRM03,
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        student: {
          select: {
            name: true,
            last_name: true,
            school_number: true,
          },
        },
        form: {
          select: {
            id: true,
            start_date: true,
            end_date: true,
            edu_year: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ data: internStatuses });
  } catch (error) {
    next(error);
  }
};
