import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { AuthorizationError } from "../../errors/AuthorizationError";
import { BadRequestError } from "../../errors/BadRequestError";
import {
  isSealedQueryCheck,
  releatedRecordQueryControl,
} from "../../handlers/query.handler";

export const getAllSurveys = async (req, res, next) => {
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
    const { eduYearId, studentId, comissionId, status, isSealed } = req.query;

    const surveys = await prisma.survey.findMany({
      take: Number(pageSize) || 10,
      skip: Number(page) * Number(pageSize) || undefined,
      select: {
        id: true,
        createdAt: true,
      },
      orderBy: [{ [sortedBy]: sortedWay }],
      where: {
        interview: { student: recordControl },
        // createdBy: createdBy,
        AND: [
          studentId
            ? { interview: { student: { id: { equals: studentId } } } }
            : {},
          comissionId
            ? { interview: { comission: { id: { equals: comissionId } } } }
            : {},
          eduYearId
            ? {
                interview: {
                  internStatus: {
                    form: { edu_year: { id: { equals: eduYearId * 1 } } },
                  },
                },
              }
            : {},
          status
            ? {
                interview: {
                  internStatus: {
                    status: status,
                  },
                },
              }
            : {},
          isSealed ? { isSealed: isSealed === "true" } : {},
        ],
      },
    });

    const surveyCount = await prisma.survey.count({
      where: {
        interview: { student: recordControl },
        // createdBy: createdBy,
        AND: [
          studentId
            ? { interview: { student: { id: { equals: studentId } } } }
            : {},
          comissionId
            ? { interview: { comission: { id: { equals: comissionId } } } }
            : {},
          eduYearId
            ? {
                interview: {
                  internStatus: {
                    form: { edu_year: { id: { equals: eduYearId * 1 } } },
                  },
                },
              }
            : {},
          status
            ? {
                interview: {
                  internStatus: {
                    status: status,
                  },
                },
              }
            : {},
          isSealed ? { isSealed: isSealed === "true" } : {},
        ],
      },
    });

    res.status(200).json({ data: surveys, dataLenth: surveyCount });
  } catch (e) {
    next(e);
  }
};

export const getSingleSurvey = async (req, res, next) => {
  try {
    const surveyId = req.params.surveyId;

    const userId = req.id;
    const userRole = req.roles;

    const recordControl = releatedRecordQueryControl(userRole, userId);

    const selectUserTag = { select: { id: true, name: true, last_name: true } };

    const survey = await prisma.survey.findUnique({
      where: { id: surveyId, interview: { student: recordControl } },
      select: {
        createdBy: selectUserTag,
        company_name: true,
        company_address: true,

        teach_type: true,
        gano: true,
        intern_group: true,
        intern_type: true,
        updatedAt: true,
        updatedBy: true,
        date: true,
        answers: true,
      },
    });

    if (!survey) {
      throw new BadRequestError(errorCodes.NOT_FOUND);
    }

    res.status(200).json({ data: survey });
  } catch (e) {
    next(e);
  }
};

export const addNewSurvey = async (req, res, next) => {
  try {
    const {
      interviewId,
      company_name,
      company_address,
      teach_type,
      gano,
      intern_group,
      intern_type,
      date,
      answers,
    } = req.body;

    const userId = req.id;

    const isDuplicateSurvey = await prisma.survey.findFirst({
      where: {
        interview: { id: { equals: interviewId } },
        isSealed: false,
      },
    });

    if (isDuplicateSurvey) {
      throw new BadRequestError(errorCodes.SUR_DUPLICATE);
    }

    const survey = await prisma.survey.create({
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
        company_address: company_address,
        date: new Date(date),
        answers: answers,
        teach_type: teach_type,
        gano: gano,
        intern_group: intern_group,
        intern_type: intern_type,
      },
    });

    res.status(200).json({ message: "Survey added successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateSurvey = async (req, res, next) => {
  try {
    const surveyId = req.params.surveyId;

    const {
      company_name,
      company_address,
      teach_type,
      gano,
      intern_group,
      intern_type,
      date,
      answers,
    } = req.body;

    const userRole = req.roles;

    const form = await prisma.survey.findUnique({
      where: {
        id: surveyId,
      },
    });

    if (isSealedQueryCheck(userRole, form.isSealed)) {
      throw new AuthorizationError(errorCodes.NOT_PERMISSION);
    }

    const updatedSurvey = await prisma.survey.update({
      where: {
        id: surveyId,
      },
      data: {
        company_name: company_name,
        company_address: company_address,
        date: new Date(date),
        answers: answers,
        teach_type: teach_type,
        gano: gano,
        intern_group: intern_group,
        intern_type: intern_type,
      },
    });

    res.status(200).json({ message: "survey has been updated succesfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteSurvey = async (req, res, next) => {
  try {
    const surveyId = req.params.surveyId;

    const deletedRecord = await prisma.survey.findUnique({
      where: { id: surveyId },
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
      where: { id: surveyId },
      data: updateData,
    });

    return res.status(200).json({ message: "survey deleted succesfully" });
  } catch (e) {
    next(e);
  }
};

export const getCompanyInfoForSurvey = async (req, res, next) => {
  try {
    const { interviewId } = req.params;

    const internStatus = await prisma.internStatus.findFirst({
      where: {
        interview: {
          id: interviewId,
        },
      },
      select: {
        student: {
          select: {
            id: true,
            name: true,
            last_name: true,
            school_number: true,
            tc_number: true,
          },
        },
        form: {
          select: {
            edu_program: true,
            student_info: {
              select: {
                birth_date: true,
                birth_place: true,
              },
            },
            start_date: true,
            end_date: true,
            company_info: {
              select: {
                name: true,
                address: true,
              },
            },
          },
        },
      },
    });

    if (!internStatus) {
      throw new BadRequestError(errorCodes.NOT_FOUND);
    }

    res.status(200).json({ data: internStatus });
  } catch (error) {
    next(error);
  }
};
