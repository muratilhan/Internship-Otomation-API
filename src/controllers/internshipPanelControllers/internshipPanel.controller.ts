import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import InternStatus from "../../enums/internStatus";
import { BadRequestError } from "../../errors/BadRequestError";

// TODO: internShip panel services
function createManyInterviewAdapter(interview, userId) {
  const { date, comissionId, student_id } = interview;
  return {
    updatedBy: {
      connect: {
        id: userId,
      },
    },

    date: new Date(date),

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

    // const { date, comissionId, interviewId } = interviews;

    await prisma.$transaction(
      async (prisma) => {
        for (let index = 0; index < interviews.length; index++) {
          const interview = await prisma.interview.findUnique({
            where: { id: interviews[index].interviewId },
          });

          if (!interview) {
            throw new BadRequestError(errorCodes.NOT_FOUND);
          }

          interviews[index] = {
            ...interviews[index],
            student_id: interview.student_id,
          };

          const interviewCreate = createManyInterviewAdapter(
            interviews[index],
            userId
          );

          await prisma.interview.update({
            where: { id: interview.id },
            data: interviewCreate,
          });

          const releatedInternStatus = await prisma.internStatus.findUnique({
            where: {
              interview_id: interview.id,
            },
          });

          const newInternStatusTrack = await prisma.internStatusTrack.create({
            data: {
              createdBy: {
                connect: {
                  id: userId,
                },
              },
              prevStatus: releatedInternStatus.status,
              nextStatus: InternStatus.MLK02,
              desc: "",
              internStatus: {
                connect: {
                  id: releatedInternStatus.id,
                },
              },
            },
          });

          await prisma.internStatus.update({
            where: {
              id: releatedInternStatus.id,
            },
            data: {
              updatedBy: {
                connect: {
                  id: userId,
                },
              },
              status: InternStatus.MLK02,
            },
          });
        }

        return res
          .status(200)
          .json({ message: "interviews updated succesfully" });
      },
      {
        maxWait: 100000, // default: 2000
        timeout: 180000, // default: 5000
      }
    );
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
    const interviews = await prisma.interview.findMany({
      where: {
        internStatus: {
          status: InternStatus.MLK01,
        },
        date: {
          equals: null,
        },

        comission_id: {
          equals: null,
        },
      },
      select: {
        id: true,
        createdAt: true,
        internStatus: {
          select: {
            id: true,
            status: true,
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
        },
        student: {
          select: {
            name: true,
            last_name: true,
            school_number: true,
          },
        },
      },
    });

    return res.status(200).json({ data: interviews });
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
