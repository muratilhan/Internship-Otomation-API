import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { BadRequestError } from "../../errors/BadRequestError";
import { releatedRecordQueryControl } from "../../handlers/query.handler";

export const getAllConfidentalReports = async (req, res, next) => {
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
    const {
      createdBy,
      eduYearId,
      studentId,
      companyName,
      isMailResponded,
      isSealed,
    } = req.query;

    const selectUserTag = { select: { id: true, name: true, last_name: true } };

    const confidentalReports = await prisma.confidentalReport.findMany({
      take: Number(pageSize) || 10,
      skip: Number(page) * Number(pageSize) || undefined,
      select: {
        id: true,
        createdAt: true,
        company_name: true,
        auth_name: true,
        isMailResponded: true,
        start_date: true,
        end_date: true,
        department: true,
        interview: {
          select: {
            student: selectUserTag,
            comission: selectUserTag,
          },
        },
      },
      orderBy: [{ [sortedBy]: sortedWay }],
      where: {
        AND: [
          studentId
            ? { interview: { student: { id: { contains: studentId } } } }
            : {},
          companyName ? { company_name: { contains: companyName } } : {},
          eduYearId
            ? {
                interview: {
                  internStatus: {
                    form: { edu_year: { id: { equals: eduYearId * 1 } } },
                  },
                },
              }
            : {},
          isMailResponded ? { isSealed: isMailResponded === "true" } : {},
        ],
      },
    });

    const confidentalCount = await prisma.confidentalReport.count({
      where: {
        AND: [
          studentId
            ? { interview: { student: { id: { contains: studentId } } } }
            : {},
          companyName ? { company_name: { contains: companyName } } : {},
          eduYearId
            ? {
                interview: {
                  internStatus: {
                    form: { edu_year: { id: { equals: eduYearId * 1 } } },
                  },
                },
              }
            : {},
          isMailResponded ? { isSealed: isMailResponded === "true" } : {},
        ],
      },
    });
    res
      .status(200)
      .json({ data: confidentalReports, dataLength: confidentalCount });
  } catch (e) {
    next(e);
  }
};

export const addNewConfidentalReport = async (req, res, next) => {
  try {
    const {
      interviewId,
      company_name,
      address,
      start_date,
      end_date,
      days_of_absence,
      department,
      is_edu_program,
      intern_evaluation,
      auth_name,
      auth_position,
      reg_number,
      auth_tc_number,
      auth_title,
    } = req.body;

    const userId = req.id;

    const confidentalReport = await prisma.confidentalReport.create({
      data: {
        createdBy: {
          connect: {
            id: userId,
          },
        },
        interview: {
          connect: {
            id: interviewId,
          },
        },
        company_name: company_name,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        address: address,
        days_of_absence: days_of_absence,
        department: department,
        is_edu_program: is_edu_program,
        intern_evaluation: intern_evaluation,
        auth_name: auth_name,
        auth_position: auth_position,
        reg_number: reg_number,
        auth_tc_number: auth_tc_number,
        auth_title: auth_title,
      },
    });

    res.status(200).json({ message: "confidentalReport added successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateConfidentalReport = async (req, res, next) => {
  try {
    const { confidentalReportId } = req.params;
    const userId = req.id;

    const {
      company_name,
      address,
      start_date,
      end_date,
      days_of_absence,
      department,
      is_edu_program,
      intern_evaluation,
      auth_name,
      auth_position,
      reg_number,
      auth_tc_number,
      auth_title,
    } = req.body;
    const updatedConfidentalReport = await prisma.confidentalReport.update({
      where: {
        id: confidentalReportId,
      },
      data: {
        updatedBy: {
          connect: {
            id: userId,
          },
        },
        company_name: company_name,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        address: address,
        days_of_absence: days_of_absence,
        department: department,
        is_edu_program: is_edu_program,
        intern_evaluation: intern_evaluation,
        auth_name: auth_name,
        auth_position: auth_position,
        reg_number: reg_number,
        auth_tc_number: auth_tc_number,
        auth_title: auth_title,
      },
    });

    res
      .status(200)
      .json({ message: "confidentalReport has been updated succesfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteConfidentalReport = async (req, res, next) => {
  try {
    const confidentalReportId = req.params.confidentalReportId;

    await prisma.$transaction(async (prisma) => {
      const deletedRecord = await prisma.confidentalReport.findUnique({
        where: { id: confidentalReportId },
        include: {
          interview: true,
        },
      });

      if (!deletedRecord) {
        throw new BadRequestError(errorCodes.NOT_FOUND);
      }

      let updateData = {
        isDeleted: true,
        isSealed: false,
      };

      if (deletedRecord?.interview?.id) {
        const obj = { interview: { disconnect: true } };
        updateData = Object.assign(obj, updateData);
      }

      await prisma.confidentalReport.update({
        where: { id: confidentalReportId },
        data: updateData,
      });

      return res
        .status(200)
        .json({ message: "confidentalReport deleted succesfully" });
    });
  } catch (e) {
    next(e);
  }
};

export const getSingleConfidentalReport = async (req, res, next) => {
  try {
    const { confidentalReportId } = req.params;

    const selectUserTag = { select: { id: true, name: true, last_name: true } };

    const confidentalReport = await prisma.confidentalReport.findUnique({
      where: { id: confidentalReportId },
      select: {
        id: true,
        createdAt: true,
        createdBy: selectUserTag,
        updatedAt: true,
        updatedBy: selectUserTag,

        isMailResponded: true,

        company_name: true,
        address: true,
        start_date: true,
        end_date: true,

        days_of_absence: true,
        department: true,
        is_edu_program: true,
        intern_evaluation: true,
        auth_name: true,
        auth_position: true,
        reg_number: true,
        auth_tc_number: true,
        auth_title: true,
        desc: true,

        interview: {
          select: {
            id: true,
            student: {
              select: {
                id: true,
                name: true,
                last_name: true,
                school_number: true,
                tc_number: true,
              },
            },
            date: true,
            internStatus: {
              select: {
                form: {
                  select: {
                    edu_program: true,
                    student_info: {
                      select: {
                        birth_date: true,
                        birth_place: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    res
      .status(200)
      .json({ data: confidentalReport, message: "selected data provided" });
  } catch (e) {
    next(e);
  }
};
