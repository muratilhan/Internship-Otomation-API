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
      isMailSended,
      isSealed,
    } = req.query;

    const confidentalReports = await prisma.confidentalReport.findMany({
      take: Number(pageSize) || 10,
      skip: Number(page) * Number(pageSize) || undefined,
      select: {
        id: true,
        createdAt: true,
        isSealed: true,
        company_name: true,
        isMailSended: true,
        start_date: true,
        end_date: true,
        department: true,
      },
      orderBy: [{ [sortedBy]: sortedWay }],
      where: {
        createdBy: createdBy,
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
          isSealed ? { isSealed: isSealed === "true" } : {},
          isMailSended ? { isSealed: isMailSended === "true" } : {},
        ],
      },
    });

    const confidentalCount = await prisma.confidentalReport.count({
      where: {
        createdBy: createdBy,
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
          isSealed ? { isSealed: isSealed === "true" } : {},
          isMailSended ? { isSealed: isMailSended === "true" } : {},
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

    const deletedRecord = await prisma.confidentalReport.findUnique({
      where: { id: confidentalReportId },
      include: {
        interview: true,
      },
    });

    if (!deletedRecord) {
      throw new BadRequestError(errorCodes.NOT_FOUND);
    }

    const updateData = {
      isDeleted: true,
      isSealed: false,
    };

    if (deletedRecord?.interview?.id) {
      Object.assign({ interview: null }, updateData);
    }

    await prisma.survey.update({
      where: { id: confidentalReportId },
      data: updateData,
    });
    return res
      .status(200)
      .json({ message: "confidentalReport deleted succesfully" });
  } catch (e) {
    next(e);
  }
};

export const getSingleConfidentalReport = async (req, res, next) => {
  try {
    const { confidentalReportId } = req.params;
    const confidentalReport = await prisma.confidentalReport.findUnique({
      where: { id: confidentalReportId },
    });
    res
      .status(200)
      .json({ data: confidentalReport, message: "selected data provided" });
  } catch (e) {
    next(e);
  }
};
