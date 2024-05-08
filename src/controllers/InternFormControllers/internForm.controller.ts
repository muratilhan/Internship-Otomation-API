import UserRoles from "../../config/rolesList";
import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { AuthorizationError } from "../../errors/AuthorizationError";
import { BadRequestError } from "../../errors/BadRequestError";
import {
  calculateBussinesDates,
  isHoliday,
} from "../../handlers/dates.handler";
import {
  isSealedQueryCheck,
  releatedRecordQueryControl,
} from "../../handlers/query.handler";

export const getForms = async (req, res, next) => {
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
    const {
      createdBy,
      schoolNumber,
      eduYearId,
      startDate,
      endDate,
      isSealed,
      studentId,
      name,
    } = req.query;

    const internForms = await prisma.internForm.findMany({
      take: Number(pageSize) || 10,
      skip: Number(page) * Number(pageSize) || undefined,
      select: {
        id: true,
        createdAt: true,
        start_date: true,
        isSealed: true,
        end_date: true,
        edu_year: true,
        total_work_day: true,
        student: {
          select: {
            id: true,
            name: true,
            last_name: true,
          },
        },
        follow_up: {
          select: {
            id: true,
            name: true,
            last_name: true,
          },
        },
      },
      orderBy: [{ [sortedBy]: sortedWay }],
      where: {
        student: recordControl,
        createdBy: createdBy,
        AND: [
          studentId ? { student: { id: { contains: studentId } } } : {},
          name ? { student: { name: { contains: schoolNumber } } } : {},
          schoolNumber
            ? { student: { school_number: { contains: schoolNumber } } }
            : {},
          eduYearId ? { edu_year: { id: { equals: eduYearId * 1 } } } : {},
          startDate ? { start_date: { gte: new Date(startDate) } } : {},
          endDate ? { end_date: { lte: new Date(endDate) } } : {},
          isSealed ? { isSealed: isSealed === "true" } : {},
        ],
      },
    });

    const internFormCount = await prisma.internForm.count({
      where: {
        student: recordControl,
        createdBy: createdBy,
        AND: [
          studentId ? { student: { id: { contains: studentId } } } : {},
          name ? { student: { name: { contains: schoolNumber } } } : {},
          schoolNumber
            ? { student: { school_number: { contains: schoolNumber } } }
            : {},
          eduYearId ? { edu_year: { id: { equals: eduYearId * 1 } } } : {},
          startDate ? { start_date: { gte: new Date(startDate) } } : {},
          endDate ? { end_date: { lte: new Date(endDate) } } : {},
          isSealed ? { isSealed: isSealed === "true" } : {},
        ],
      },
    });

    res.status(200).json({ data: internForms, dataLength: internFormCount });
  } catch (e) {
    next(e);
  }
};

export const addForm = async (req, res, next) => {
  try {
    // get body
    const userId = req.id;
    const userRole = req.roles;

    const { studentId, startDate, endDate, eduYearId, isInTerm, weekDayWork } =
      req.body;

    // is there any record with student id already created a record that between the start_date and end_date and not sealed

    const isDuplicateForm = await prisma.internForm.findFirst({
      where: {
        student_id: studentId,
        isSealed: false,
      },
    });

    if (isDuplicateForm) {
      throw new BadRequestError(errorCodes.INTF_DUPLICATE_FORM);
    }

    const isStudentWorkOnSaturday = weekDayWork.includes(6);

    const holidays = await prisma.holidays.findMany({ select: { date: true } });

    const totalWorkDay = calculateBussinesDates(
      startDate,
      endDate,
      holidays,
      weekDayWork
    );

    if (totalWorkDay > 60 || totalWorkDay < 1) {
      throw new BadRequestError(errorCodes.INTF_TOTAL_DAY);
    }

    console.log("ohhhhhhhh33", isHoliday(startDate, holidays));

    if (isHoliday(startDate, holidays) || isHoliday(endDate, holidays)) {
      console.log("ohhhhhhhh");
    }

    const adminUser = await prisma.user.findFirst({
      where: {
        user_type: UserRoles.admin,
      },
    });

    const newForm = await prisma.internForm.create({
      data: {
        createdBy: {
          connect: {
            id: userId,
          },
        },
        follow_up: {
          connect: {
            id: adminUser.id,
          },
        },
        student: {
          connect: {
            id: studentId,
          },
        },
        isInTerm: isInTerm,
        weekDayWork: weekDayWork,
        workOnSaturday: isStudentWorkOnSaturday,
        total_work_day: totalWorkDay,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        edu_year: {
          connect: {
            id: eduYearId,
          },
        },
      },
    });

    // InternStatus
    const newInternStatus = await prisma.internStatus.create({
      data: {
        createdBy: {
          connect: {
            id: userId,
          },
        },
        student: {
          connect: {
            id: studentId,
          },
        },
        form: {
          connect: {
            id: newForm.id,
          },
        },
      },
    });

    res
      .status(200)
      .json({ data: newForm.id, message: "form created succesfully" });
  } catch (error) {
    next(error);
  }
};

export const getFormById = async (req, res, next) => {
  try {
    const userId = req.id;
    const userRole = req.roles;

    const recordControl = releatedRecordQueryControl(userRole, userId);

    const internFormId = req.params.internFormId;

    const selectUserTag = { select: { id: true, name: true, last_name: true } };

    const internForm = await prisma.internForm.findUnique({
      where: {
        id: internFormId,
        student: recordControl,
      },
      select: {
        id: true,
        createdAt: true,
        createdBy: selectUserTag,
        updatedAt: true,
        updatedBy: selectUserTag,

        isSealed: true,

        isInTerm: true,
        weekDayWork: true,
        workOnSaturday: true,

        start_date: true,
        end_date: true,
        total_work_day: true,

        edu_faculty: true,
        edu_program: true,
        edu_year: true,

        student: {
          select: {
            id: true,
            name: true,
            last_name: true,
            school_number: true,
            tc_number: true,
          },
        },

        follow_up: selectUserTag,

        student_info: {
          select: {
            id: true,
            fathers_name: true,
            mothers_name: true,
            birth_date: true,
            birth_place: true,
            address: true,
          },
        },

        company_info: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            fax: true,
            email: true,
            service_area: true,
          },
        },
      },
    });

    if (!internForm) {
      throw new BadRequestError(errorCodes.NOT_FOUND);
    }

    res.status(200).json({ data: internForm });
  } catch (e) {
    next(e);
  }
};

export const updateForm = async (req, res, next) => {
  try {
    const userId = req.id;
    const userRole = req.roles;

    const internFormId = req.params.internFormId;

    const { studentId, startDate, endDate, eduYearId, isInTerm, weekDayWork } =
      req.body;

    const isStudentWorkOnSaturday = weekDayWork.includes(6);
    const holidays = await prisma.holidays.findMany({ select: { date: true } });

    const totalWorkDay = calculateBussinesDates(
      startDate,
      endDate,
      holidays,
      weekDayWork
    );

    if (totalWorkDay > 60 || totalWorkDay < 1) {
      throw new BadRequestError(errorCodes.INTF_TOTAL_DAY);
    }

    const adminUser = await prisma.user.findFirst({
      where: {
        user_type: UserRoles.admin,
      },
    });

    const form = await prisma.internForm.findUnique({
      where: {
        id: internFormId,
      },
    });

    if (isSealedQueryCheck(userRole, form.isSealed)) {
      throw new AuthorizationError(errorCodes.NOT_PERMISSION);
    }

    const updatedForm = await prisma.internForm.update({
      where: {
        id: internFormId,
      },
      data: {
        updatedBy: {
          connect: {
            id: userId,
          },
        },
        follow_up: {
          connect: {
            id: adminUser.id,
          },
        },
        student: {
          connect: {
            id: studentId,
          },
        },

        isInTerm: isInTerm,
        weekDayWork: weekDayWork,
        workOnSaturday: isStudentWorkOnSaturday,

        total_work_day: totalWorkDay,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        edu_year: {
          connect: {
            id: eduYearId,
          },
        },
      },
    });

    res
      .status(200)
      .json({ data: updatedForm.id, message: "form updated succesfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteForm = async (req, res, next) => {
  try {
    const internFormId = req.params.internFormId;

    const deletedRecord = await prisma.internForm.findUnique({
      where: { id: internFormId },
      include: {
        internStatus: {
          include: {
            interview: {
              include: {
                survey: true,
                confidentalReport: true,
              },
            },
          },
        },
      },
    });

    if (!deletedRecord) {
      throw new BadRequestError(errorCodes.NOT_FOUND);
    }

    const updateData: any = {
      isDeleted: true,
      isSealed: false,
      internStatus: {
        update: {
          isDeleted: true,
        },
      },
    };

    if (deletedRecord.internStatus.interview) {
      const updatedInterview = {
        interview: {
          update: {
            isDeleted: true,
          },
        },
      };
      Object.assign(updatedInterview, updateData.internStatus.update);

      if (deletedRecord.internStatus.interview.survey) {
        const updatedSurvey = {
          survey: {
            update: {
              isDeleted: true,
              isSealed: false,
            },
          },
        };
        Object.assign(
          updatedSurvey,
          updateData.internStatus.update.interview.update
        );
      }

      if (deletedRecord.internStatus.interview.confidentalReport) {
        const updatedConfidentalReport = {
          confidentalReport: {
            update: {
              isDeleted: true,
              isSealed: false,
            },
          },
        };
        Object.assign(
          updatedConfidentalReport,
          updateData.internStatus.update.interview.update
        );
      }
    }

    await prisma.internForm.update({
      where: { id: internFormId },
      data: updateData,
    });

    return res.status(200).json({ message: "Form deleted succesfully" });
  } catch (e) {
    next(e);
  }
};

export const getInternFormAC = async (req, res, next) => {
  try {
    const selectStudentTag = {
      select: { id: true, name: true, last_name: true, school_number: true },
    };
    const internForms = await prisma.internForm.findMany({
      select: {
        id: true,
        student: selectStudentTag,
        start_date: true,
        end_date: true,
        company_info: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const modifiedInternForms = internForms.map((internForm) => ({
      id: internForm.id,
      label: `${internForm.student.name} ${internForm.student.last_name}`,
      subtext: `${internForm.start_date}\n${internForm.end_date}\n${internForm.company_info.name}`,
    }));

    res.status(200).json({ data: modifiedInternForms || [] });
  } catch (error) {
    next(error);
  }
};
