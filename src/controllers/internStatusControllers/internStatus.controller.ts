import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import InternStatus from "../../enums/internStatus";
import { BadRequestError } from "../../errors/BadRequestError";
import { formatDate } from "../../handlers/dates.handler";
import { releatedRecordQueryControl } from "../../handlers/query.handler";

export const getInternStatuses = async (req, res, next) => {
  try {
    // get pagination
    const { pageSize, page } = req.query;

    const userId = req.id;
    const userRole = req.roles;

    const recordControl = releatedRecordQueryControl(userRole, userId);

    // get sort
    let { sortedBy, sortedWay } = req.query;

    if (!sortedBy) {
      sortedBy = "createdAt";
    }
    if (!sortedWay) {
      sortedWay = "asc";
    }

    // get filter
    const { eduYearId, studentId, comissionId, status } = req.query;

    const internStatuses = await prisma.internStatus.findMany({
      take: Number(pageSize) || 10,
      skip: Number(page) * Number(pageSize) || undefined,
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
        student: {
          select: {
            id: true,
            name: true,
            last_name: true,
            school_number: true,
            tc_number: true,
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
                form: {
                  edu_year: {
                    id: {
                      equals: eduYearId * 1 || undefined,
                    },
                  },
                },
              }
            : {},
          comissionId
            ? {
                interview: {
                  comission: {
                    id: {
                      contains: comissionId,
                    },
                  },
                },
              }
            : {},
          status ? { status: status } : {},
        ],
      },
    });

    const internStatusesCount = await prisma.internStatus.count({
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
                form: {
                  edu_year: {
                    id: {
                      equals: eduYearId * 1 || undefined,
                    },
                  },
                },
              }
            : {},
          comissionId
            ? {
                interview: {
                  comission: {
                    id: {
                      contains: comissionId,
                    },
                  },
                },
              }
            : {},
          status ? { status: status } : {},
        ],
      },
    });

    return res
      .status(200)
      .json({ data: internStatuses, dataLength: internStatusesCount });
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

        student: {
          select: {
            id: true,
            name: true,
            last_name: true,
            school_number: true,
            tc_number: true,
          },
        },
        status: true,
        internStatusTracks: {
          where: {
            internStatusId: internStatusId,
          },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            createdAt: true,
            createdBy: selectUserTag,
            prevStatus: true,
            nextStatus: true,
            desc: true,
          },
        },

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

    const { status, desc } = req.body;

    const form = await prisma.internStatus.findUnique({
      where: {
        id: internStatusId,
      },
    });

    if (!form) {
      throw new BadRequestError(errorCodes.NOT_FOUND);
    }

    if (desc) {
      const newInternStatusTrack = await prisma.internStatusTrack.create({
        data: {
          createdBy: {
            connect: {
              id: userId,
            },
          },
          prevStatus: form.status,
          nextStatus: status,
          desc: desc,
          internStatus: {
            connect: {
              id: form.id,
            },
          },
        },
      });
    }

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
        status: status,
        form: {
          update: {
            data: {
              isSealed: true,
            },
          },
        },
      },
    });

    res.status(200).json({ message: "intern status updated succesfully" });
  } catch (error) {
    next(error);
  }
};

export const getInternStatusAC = async (req, res, next) => {
  try {
    const selectStudentTag = {
      select: { id: true, name: true, last_name: true, school_number: true },
    };
    const internStatuses = await prisma.internStatus.findMany({
      select: {
        id: true,
        student: selectStudentTag,
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
    });

    const modifiedInternForms = internStatuses
      .filter((internStatus) => internStatus.form)
      .map((internStatus) => ({
        id: internStatus.id,
        label: `${internStatus.student.name} ${internStatus.student.last_name}`,
        subtext: `${internStatus.student.school_number || ""}\n${formatDate(
          internStatus.form.start_date
        )} - ${formatDate(internStatus.form.end_date)}\n${
          internStatus.form.company_info.name
        }`,
        translate: internStatus.status,
      }));

    res.status(200).json({ data: modifiedInternForms || [] });
  } catch (error) {
    next(error);
  }
};
