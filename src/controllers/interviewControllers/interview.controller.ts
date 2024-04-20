import prisma from "../../db";

export const getInterviews = async (req, res, next) => {
  try {
    const selectUserTag = { select: { id: true, name: true, last_name: true } };
    const interviews = await prisma.interview.findMany({
      select: {
        id: true,
        date: true,
        intern: selectUserTag,
        comission: selectUserTag,
        InternStatus: {
          select: {
            status: true,
          },
        },
      },
    });

    res.status(200).json({ data: interviews, dataLength: interviews.length });
  } catch (error) {
    next(error);
  }
};

export const getInterviewById = async (req, res, next) => {
  try {
    const interviewId = req.params.interviewId;

    const selectUserTag = { select: { id: true, name: true, last_name: true } };

    const interview = await prisma.interview.findUnique({
      where: {
        id: interviewId,
      },
      select: {
        id: true,
        createdAt: true,
        createdBy: selectUserTag,
        updatedAt: true,
        updatedBy: selectUserTag,
        isSealed: true,
        date: true,

        intern: {
          select: {
            id: true,
            name: true,
            last_name: true,
            tc_number: true,
            school_number: true,
          },
        },

        comission: selectUserTag,
        InternStatus: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    res.status(200).json({ data: interview });
  } catch (error) {
    next(error);
  }
};

export const addNewInterview = async (req, res, next) => {
  try {
    const userId = req.id;

    const { date, comissionId, internStatusId, internId } = req.body;

    const newInterview = await prisma.interview.create({
      data: {
        createdBy: {
          connect: {
            id: userId,
          },
        },
        date: new Date(date),

        InternStatus: {
          connect: {
            id: internStatusId,
          },
        },

        intern: {
          connect: {
            id: internId,
          },
        },

        comission: {
          connect: {
            id: comissionId,
          },
        },
      },
    });

    res.status(200).json({ message: "interview added succesfully" });
  } catch (error) {
    next(error);
  }
};

export const updateInterview = async (req, res, next) => {
  try {
    const userId = req.id;

    const interviewId = req.params.interviewId;

    const { date, comissionId } = req.body;

    const updatedForm = await prisma.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        updatedBy: {
          connect: {
            id: userId,
          },
        },
        date: new Date(date),

        comission: {
          connect: {
            id: comissionId,
          },
        },
      },
    });

    res.status(200).json({ message: "interview updated succesfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteInterview = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
