import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { BadRequestError } from "../../errors/BadRequestError";

export const addNewSurvey = async (req, res, next) => {
  try {
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
    const userId = req.id;

    const survey = await prisma.survey.create({
      data: {
        createdBy: {
          connect: {
            id: userId,
          },
        },
        company_name: company_name,
        company_address: company_address,
        date: new Date("2024-03-25"),
        answers: answers,
        teach_type: teach_type,
        gano: gano,
        intern_group: intern_group,
        intern_type: intern_type,
      },
    });

    res.status(200).json({ message: "Survey added successfully", survey });
  } catch (error) {
    next(error);
  }
};

export const getAllSurveys = async (req, res, next) => {
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
    const { eduYearId, studentId, comissionId, status } = req.query;

    const surveys = await prisma.survey.findMany();

    res.status(200).json({ data: surveys, dataLenth: surveys.length });
  } catch (e) {
    next(e);
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
    console.log(req.body);
    const updatedSurvey = await prisma.survey.update({
      where: {
        id: surveyId,
      },
      data: {
        company_name: company_name,
        company_address: company_address,
        date: new Date("11/22/2020"),
        answers: answers,
        teach_type: teach_type,
        gano: gano,
        intern_group: intern_group,
        intern_type: intern_type,
      },
    });
    console.log(updateSurvey);
    res
      .status(200)
      .json({ message: "survey has been updated succesfully", updatedSurvey });
  } catch (error) {
    next(error);
  }
};

export const deleteSurvey = async (req, res, next) => {
  try {
    const surveyId = req.params.surveyId;

    await prisma.survey.delete({ where: { id: surveyId } });
    res.status(200).json({ message: "survey deleted succesfully" });
  } catch (e) {
    next(e);
  }
};

export const deleteSurveys = async (req, res, next) => {
  try {
    await prisma.survey.deleteMany();
    res.status(200).json({ message: "surveys deleted succesfully" });
  } catch (e) {
    next(e);
  }
};

export const getSingleSurvey = async (req, res, next) => {
  try {
    const surveyId = req.params.surveyId;
    const selectUserTag = { select: { id: true, name: true, last_name: true } };
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      select: {
        createdBy: selectUserTag,
        company_name: true,
        company_address: true,

        teach_type: true, // maybe Enum
        gano: true, // maybe Enum
        intern_group: true, // maybe Enum
        intern_type: true, // maybe Enum
        updatedAt: true,
        updatedBy: true,
        date: true,
        answers: true,
      },
    });
    res.status(200).json(survey);
  } catch (e) {
    next(e);
  }
};
