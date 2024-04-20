import prisma from "../../db";

export const getInternStatuses = async (req, res, next) => {
  try {
    const internStatuses = await prisma.internStatus.findMany({
      select: {
        id: true,
        status: true,
        isSealed: true,
        form: {
          select: {
            id: true,
            follow_up: {
              select: {
                name: true,
                last_name: true,
              },
            },
          },
        },
        interview: {
          select: {
            id: true,
            comission: {
              select: {
                name: true,
                last_name: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            last_name: true,
            school_number: true,
            tc_number: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json({ data: internStatuses, dataLength: internStatuses.length });
  } catch (error) {
    next(error);
  }
};

export const getInternStatusById = async (req, res, next) => {
  try {
    const internStatusId = req.params.internStatusId;

    const selectUserTag = { select: { id: true, name: true, last_name: true } };

    const internStatus = await prisma.internStatus.findUnique({
      where: {
        id: internStatusId,
      },
      select: {
        id: true,
        createdAt: true,
        createdBy: selectUserTag,
        updatedAt: true,
        updatedBy: selectUserTag,

        interview_id: true,
        form_id: true,

        user: {
          select: {
            id: true,
            name: true,
            last_name: true,
            school_number: true,
            tc_number: true,
          },
        },
        status: true,

        form: {
          select: {
            id: true,
            follow_up: {
              select: {
                name: true,
                last_name: true,
              },
            },
          },
        },
        interview: {
          select: {
            id: true,
            date: true,
            comission: {
              select: {
                name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({ data: internStatus });
  } catch (error) {
    next(error);
  }
};

export const updateInternStatus = async (req, res, next) => {
  try {
    const userId = req.id;

    const internStatusId = req.params.internStatusId;

    const { formId, studentId, interviewId, status } = req.body;

    const updatedForm = await prisma.internStatus.update({
      where: {
        id: internStatusId,
      },
      data: {
        updatedBy: {
          connect: {
            id: userId,
          },
        },
        form: {
          connect: {
            id: formId,
          },
        },
        user: {
          connect: {
            id: studentId,
          },
        },
        interview: {
          connect: interviewId,
        },

        status: status,
      },
    });

    res.status(200).json({ message: "intern status updated succesfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteInternStatus = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const updateOnlyStatus = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
