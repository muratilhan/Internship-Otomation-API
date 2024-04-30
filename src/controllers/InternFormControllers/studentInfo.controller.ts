import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { BadRequestError } from "../../errors/BadRequestError";
import { isSealedQueryCheck } from "../../handlers/query.handler";

export const addStudentInfo = async (req, res, next) => {
  try {
    const {
      internFormId,
      fathersName,
      mothersName,
      birthDate,
      birthPlace,
      address,
    } = req.body;

    await prisma.studentInfo.create({
      data: {
        InternForm: {
          connect: {
            id: internFormId,
          },
        },
        fathers_name: fathersName,
        mothers_name: mothersName,
        birth_date: new Date(birthDate),
        birth_place: birthPlace,
        address: address,
      },
    });

    res.status(200).json({ message: "Student Info added succesfully" });
  } catch (error) {
    next(error);
  }
};

export const updateStudentInfo = async (req, res, next) => {
  try {
    const userRole = req.roles;

    const studentInfoId = req.params.studentInfoId;

    const {
      internFormId,
      fathersName,
      mothersName,
      birthDate,
      birthPlace,
      address,
    } = req.body;

    const studentInfo = await prisma.studentInfo.findUnique({
      where: {
        id: studentInfoId,
      },
    });

    if (isSealedQueryCheck(userRole, studentInfo.isSealed)) {
      res.status(403).json({ message: "cant access the record" });
    }

    await prisma.studentInfo.update({
      where: {
        id: studentInfoId,
      },
      data: {
        InternForm: {
          connect: {
            id: internFormId,
          },
        },
        fathers_name: fathersName,
        mothers_name: mothersName,
        birth_date: birthDate,
        birth_place: birthPlace,
        address: address,
      },
    });

    res.status(200).json({ message: "Student Info updated succesfully" });
  } catch (error) {
    next(error);
  }
};
