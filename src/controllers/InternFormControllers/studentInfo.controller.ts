import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import resultCodes from "../../enums/resultCodes";
import { AuthorizationError } from "../../errors/AuthorizationError";
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

    return res.status(200).json({ message: resultCodes.CREATE_SUCCESS });
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
      throw new AuthorizationError(errorCodes.NOT_PERMISSION);
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

    return res.status(200).json({ message: resultCodes.UPDATE_SUCCESS });
  } catch (error) {
    next(error);
  }
};
