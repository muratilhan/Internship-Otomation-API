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
        isMailResponded: true,
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

export const addNewActiveFollowUp = async (req, res, next) => {
  try {
    const { followUpId } = req.body;

    const activeFollowUp = await prisma.activeFollowUp.findFirst();

    if (activeFollowUp) {
      throw new BadRequestError(errorCodes.INP_FOLLOW_UP_DUPLICATE);
    }

    const newRecord = await prisma.activeFollowUp.create({
      data: {
        active_follow_up: {
          connect: {
            id: followUpId,
          },
        },
      },
    });

    return res.status(200).json({ message: "succesfully init" });
  } catch (error) {
    next(error);
  }
};

export const getActiveFollowUp = async (req, res, next) => {
  try {
    const activeFollowUp = await prisma.activeFollowUp.findFirst({
      select: {
        id: true,
        active_follow_up: {
          select: {
            id: true,
            name: true,
            last_name: true,
            tc_number: true,
          },
        },
      },
    });

    return res.status(200).json({ data: activeFollowUp });
  } catch (error) {
    next(error);
  }
};

export const updateActiveFollowUp = async (req, res, next) => {
  try {
    const { activeFollowUpId } = req.params;
    const { followUpId } = req.body;

    const updateActiveFollowUp = await prisma.activeFollowUp.update({
      where: {
        id: activeFollowUpId * 1,
      },
      data: {
        active_follow_up: {
          connect: {
            id: followUpId,
          },
        },
      },
    });

    if (!updateActiveFollowUp) {
      throw new BadRequestError(errorCodes.NOT_FOUND);
    }

    return res.status(200).json({ message: "record updated successfully" });
  } catch (error) {
    next(error);
  }
};
