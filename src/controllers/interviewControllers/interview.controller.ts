import prisma from "../../db";

export const getInterviews = async (req, res, next) => {
  try {
    // get pagination
    const { pageSize, page } = req.query;

    // get sort
    let { sortedBy, sortedWay } = req.query;

    if (!sortedBy) {
      sortedBy = "createdAt";
    }
    if (!sortedWay) {
      sortedWay = "asc";
    }

    // get filter
    const { createdBy, eduYearId, date, status, comissionId, studentId } =
      req.query;

    const selectUserTag = { select: { id: true, name: true, last_name: true } };
    const interviews = await prisma.interview.findMany({
      take: Number(pageSize) || 10,
      skip: Number(page) * Number(pageSize) || undefined,
      select: {
        id: true,
        date: true,
        student: selectUserTag,
        comission: selectUserTag,
        internStatus: {
          select: {
            status: true,
          },
        },
      },
      orderBy: [{ [sortedBy]: sortedWay }],
      where: {
        AND: [
          studentId
            ? {
                student: {
                  id: {
                    contains: studentId,
                  },
                },
              }
            : {},
          eduYearId
            ? {
                internStatus: {
                  form: {
                    edu_year: {
                      id: {
                        equals: eduYearId * 1 || undefined,
                      },
                    },
                  },
                },
              }
            : {},
          comissionId
            ? {
                comission: {
                  id: {
                    contains: comissionId,
                  },
                },
              }
            : {},
          status
            ? {
                internStatus: {
                  status: status,
                },
              }
            : {},

          date ? { date: date } : {},
        ],
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

        student: {
          select: {
            id: true,
            name: true,
            last_name: true,
            tc_number: true,
            school_number: true,
          },
        },

        comission: selectUserTag,
        internStatus: {
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

        internStatus: {
          connect: {
            id: internStatusId,
          },
        },

        student: {
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
