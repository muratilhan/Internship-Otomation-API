import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { BadRequestError } from "../../errors/BadRequestError";

export const addNewForm = async (req, res, next) => {
  try {
    const { start_date, end_date, edu_year } = req.body;

    const student_id = req.id;

    const date1 = new Date(start_date);
    const date2 = new Date(end_date);

    const comission_user = await prisma.user.findFirst({
      where: { user_type: "ADMIN" },
    });

    const newForm = await prisma.internForm.create({
      data: {
        start_date: date1,
        end_date: date2,
        edu_year: edu_year,
        total_work_day: 40,
        student: {
          connect: {
            id: student_id,
          },
        },

        follow_up: {
          connect: {
            id: comission_user.id,
          },
        },
      },
    });

    res.status(201).json({ message: newForm });
  } catch (e) {
    next(e);
  }
};

export const getAllForms = async (req, res, next) => {
  try {
    const allForms = await prisma.internForm.findMany();
    res.status(200).json({ message: allForms });
  } catch (e) {
    next(e);
  }
};
