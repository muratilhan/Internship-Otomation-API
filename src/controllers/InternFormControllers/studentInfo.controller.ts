import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { BadRequestError } from "../../errors/BadRequestError";

export const addNewStudentInfo = async (req, res, next) => {
  try {
    const { fathers_name, mothers_name, birth_place, address, internForm_id } =
      req.body;

    const birth_date = new Date("2022-03-25");

    const newStudentInfo = await prisma.studentInfo.create({
      data: {
        fathers_name: fathers_name,
        mothers_name: mothers_name,
        birth_place: birth_place,
        birth_date: birth_date,
        address: address,
        InternForm: {
          connect: {
            id: internForm_id,
          },
        },
      },
    });

    res.status(201).json({ message: newStudentInfo });
  } catch (e) {
    next(e);
  }
};

export const updateSingleStudentInfo = async (req, res, next) => {
  try {
    const { studentInfo_id } = req.body;
    const updated_StudentInfo = await prisma.studentInfo.update({
      where: {
        id: studentInfo_id,
      },
      data: {
        fathers_name: req.fathers_name,
        mothers_name: req.mothers_name,
        birth_place: req.birth_place,
        birth_date: req.birth_date,
        address: req.address,
        InternForm: {
          connect: {
            id: req.internForm_id,
          },
        },
      },
    });

    res.status(201).json({ message: updated_StudentInfo });
  } catch (e) {
    next(e);
  }
};

export const getSingleStudentInfo = async (req, res, next) => {
  try {
    const { studentInfo_id } = req.body;

    const studentInfo = await prisma.studentInfo.findUnique({
      where: {
        id: studentInfo_id,
      },
    });

    res.status(201).json({ message: studentInfo });
  } catch (e) {
    next(e);
  }
};

export const getAllStudentInfos = async (req, res, next) => {
  try {
    const allStudentInfos = await prisma.studentInfo.findMany();

    res.status(201).json({ message: allStudentInfos });
  } catch (e) {
    next(e);
  }
};

export const deleteSingleStudentInfo = async (req, res, next) => {
  try {
    const studentInfo_id = req.body.studentInfo_id;

    await prisma.studentInfo.delete({
      where: {
        id: studentInfo_id,
      },
    });
    res.status(200).json({ message: "removed" });
  } catch (e) {
    next(e);
  }
};

export const deleteAllStudentInfos = async (req, res, next) => {
  try {
    await prisma.studentInfo.deleteMany();
    res.status(200).json({ message: "successfully removed" });
  } catch (e) {
    next(e);
  }
};
