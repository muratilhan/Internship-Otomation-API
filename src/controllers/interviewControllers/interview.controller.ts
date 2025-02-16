import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import resultCodes from "../../enums/resultCodes";
import { BadRequestError } from "../../errors/BadRequestError";
import { formatDate } from "../../handlers/dates.handler";
import { releatedRecordQueryControl } from "../../handlers/query.handler";

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

    const userId = req.id;
    const userRole = req.roles;

    const recordControl = releatedRecordQueryControl(userRole, userId);

    // get filter
    const {
      createdBy,
      eduYearId,
      status,
      comissionId,
      studentId,
      date_gte,
      date_lte,
    } = req.query;

    const selectUserTag = { select: { id: true, name: true, last_name: true } };

    const interviews = await prisma.interview.findMany({
      take: Number(pageSize) || 10,
      skip: Number(page) * Number(pageSize) || undefined,
      select: {
        id: true,
        createdAt: true,
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
        student: recordControl,
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

          date_gte || date_lte
            ? {
                date: {
                  gte: date_gte ? new Date(date_gte) : undefined,
                  lte: date_lte ? new Date(date_lte) : undefined,
                },
              }
            : {},
        ],
      },
    });

    const interviewCount = await prisma.interview.count({
      where: {
        student: recordControl,
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

          date_gte || date_lte
            ? {
                date: {
                  gte: date_gte ? new Date(date_gte) : undefined,
                  lte: date_lte ? new Date(date_lte) : undefined,
                },
              }
            : {},
        ],
      },
    });

    return res
      .status(200)
      .json({ data: interviews, dataLength: interviewCount });
  } catch (error) {
    next(error);
  }
};

export const getInterviewById = async (req, res, next) => {
  try {
    const interviewId = req.params.interviewId;

    const userId = req.id;
    const userRole = req.roles;

    const recordControl = releatedRecordQueryControl(userRole, userId);

    const selectUserTag = { select: { id: true, name: true, last_name: true } };

    const interview = await prisma.interview.findUnique({
      where: {
        id: interviewId,
        student: recordControl,
      },
      select: {
        id: true,
        createdAt: true,
        createdBy: selectUserTag,
        updatedAt: true,
        updatedBy: selectUserTag,
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

        survey: {
          select: {
            id: true,
          },
        },

        confidentalReport: {
          select: {
            id: true,
          },
        },

        lastDateOfMailSended: true,
      },
    });

    if (!interview) {
      throw new BadRequestError(errorCodes.NOT_FOUND);
    }

    return res.status(200).json({ data: interview });
  } catch (error) {
    next(error);
  }
};

export const addNewInterview = async (req, res, next) => {
  try {
    const userId = req.id;

    const { date, comissionId, internStatusId } = req.body;

    const internStatus = await prisma.internStatus.findUnique({
      where: { id: internStatusId },
    });

    if (!internStatus) {
      throw new BadRequestError(errorCodes.NOT_FOUND);
    }

    if (internStatus.interview_id) {
      throw new BadRequestError(errorCodes.INV_DUPLICATE);
    }

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
            id: internStatus.student_id,
          },
        },

        comission: {
          connect: {
            id: comissionId,
          },
        },
      },
    });

    return res.status(200).json({ message: resultCodes.CREATE_SUCCESS });
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

    return res.status(200).json({ message: resultCodes.UPDATE_SUCCESS });
  } catch (error) {
    next(error);
  }
};

export const deleteInterview = async (req, res, next) => {
  try {
    const interviewId = req.params.interviewId;

    const deletedRecord = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        survey: true,
        confidentalReport: true,
        internStatus: true,
      },
    });

    if (!deletedRecord) {
      throw new BadRequestError(errorCodes.NOT_FOUND);
    }

    let updateData = {
      isDeleted: true,
    };

    if (deletedRecord?.internStatus?.id) {
      updateData = Object.assign(
        { internStatus: { disconnect: true } },
        updateData
      );
    }

    if (deletedRecord?.survey?.id) {
      updateData = Object.assign(
        { survey: { update: { isDeleted: true, isSealed: false } } },
        updateData
      );
    }

    if (deletedRecord?.confidentalReport?.id) {
      updateData = Object.assign(
        {
          confidentalReport: {
            update: {
              isDeleted: true,
              isSealed: false,
            },
          },
        },
        updateData
      );
    }

    await prisma.interview.update({
      where: { id: interviewId },
      data: updateData,
    });

    return res.status(200).json({ message: resultCodes.DELETE_SUCCES });
  } catch (error) {
    next(error);
  }
};

export const getInterviewAC = async (req, res, next) => {
  try {
    const userId = req.id;
    const userRole = req.roles;

    const recordControl = releatedRecordQueryControl(userRole, userId);

    const selectStudentTag = {
      select: { id: true, name: true, last_name: true, school_number: true },
    };

    const interviews = await prisma.interview.findMany({
      where: {
        student: recordControl,
      },
      select: {
        id: true,
        student: selectStudentTag,
        comission: selectStudentTag,
        date: true,
        survey_id: true,
        confidentalReport_id: true,
        internStatus: {
          select: {
            status: true,
            form: {
              select: {
                start_date: true,
                end_date: true,
                company_info: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const modifiedInternForms = interviews.map((interview) => ({
      id: interview.id,
      label: `${interview.student.name} ${interview.student.last_name} - ${
        interview.student.school_number || ""
      } `,
      subtext: `${formatDate(interview.date)}\n ${
        interview?.comission?.name || ""
      } - ${interview?.comission?.last_name || ""}`,
      translate: interview.internStatus.status,
    }));

    return res.status(200).json({ data: modifiedInternForms || [] });
  } catch (error) {
    next(error);
  }
};
