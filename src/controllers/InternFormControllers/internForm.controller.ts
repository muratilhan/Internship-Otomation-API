import UserRoles from "../../config/rolesList";
import prisma from "../../db";
import { calculateBussinesDates } from "../../handlers/dates.handler";

export const getForms = async (req, res, next) => {
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
    const { createdBy, schoolNumber, eduYear, startDate, endDate, isSealed } =
      req.query;

    const users = await prisma.internForm.findMany({
      take: Number(pageSize) || 10,
      skip: Number(page) * Number(pageSize) || undefined,
      select: {
        id: true,
        createdAt: true,
        start_date: true,
        end_date: true,
        edu_year: true,
        total_work_day: true,
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        follow_up: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ [sortedBy]: sortedWay }],
      where: {
        createdBy: createdBy,
        // bu studentId o id değil
        student: {
          school_number: {
            contains: schoolNumber,
          },
        },
        edu_year: eduYear,
        // TODO: start_date ve end_date kontrolü
        // start_date: {
        //   lte: startDate,
        // },
        // end_date: {
        //   gte: endDate,
        // },
        isSealed: isSealed,
      },
    });

    res.status(200).json({ data: users, dataLength: users.length });
  } catch (e) {
    next(e);
  }
};

export const addForm = async (req, res, next) => {
  try {
    // get body
    const userId = req.id;

    const { studentId, startDate, endDate, eduYear } = req.body;

    // is there any record with student id already created a record that between the start_date and end_date and not sealed

    const isDuplicateForm = await prisma.internForm.findFirst({
      where: {
        isDeleted: false,
        student_id: studentId,
        isSealed: false,
      },
    });

    if (isDuplicateForm) {
      return res
        .status(400)
        .json({ message: "you cannot create another internship form" });
    }

    // TODO: calculate the totalWorkDay
    const holidays = await prisma.holidays.findMany({ select: { date: true } });

    const totalWorkDay = calculateBussinesDates(startDate, endDate, holidays);

    console.log(totalWorkDay);

    if (totalWorkDay > 60 || totalWorkDay < 1) {
      return res.status(400).json({ message: "totalwork day is not " });
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
        total_work_day: totalWorkDay,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        edu_year: eduYear,
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
    const internFormId = req.params.internFormId;

    const selectUserTag = { select: { id: true, name: true, last_name: true } };

    const internForm = await prisma.internForm.findUnique({
      where: {
        id: internFormId,
      },
      select: {
        id: true,
        createdAt: true,
        createdBy: selectUserTag,
        updatedAt: true,
        updatedBy: selectUserTag,

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

    res.status(200).json({ data: internForm });
  } catch (e) {
    next(e);
  }
};

export const updateForm = async (req, res, next) => {
  // get body
  // if person was student and the record is sealed he / she cannot update the record --> this should be handled in prisma.use middleware
  try {
    const userId = req.id;

    const internFormId = req.params.internFormId;

    const { studentId, startDate, endDate, eduYear } = req.body;

    // TODO: calculate the totalWorkDay
    const holidays = await prisma.holidays.findMany({ select: { date: true } });

    const totalWorkDay = calculateBussinesDates(startDate, endDate, holidays);

    if (totalWorkDay > 60 || totalWorkDay < 1) {
      res.status(400).json({ message: "totalwork day is not " });
    }

    const adminUser = await prisma.user.findFirst({
      where: {
        user_type: UserRoles.admin,
      },
    });

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
        total_work_day: totalWorkDay,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        edu_year: eduYear,
      },
    });

    res.status(200).json({ message: "form updated succesfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteForm = async (req, res, next) => {
  try {
    const internFormId = req.params.internFormId;

    await prisma.internForm.delete({ where: { id: internFormId } });
    res.status(200).json({ message: "Form deleted succesfully" });
  } catch (e) {
    next(e);
  }
};
