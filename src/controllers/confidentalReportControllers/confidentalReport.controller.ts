import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { BadRequestError } from "../../errors/BadRequestError";

export const addNewConfidentalReport = async (req, res, next) => {
  try {
    console.log("burası confidental addd");
    const {
      school_number,
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
        school_number: "0320 33 333",
        company_name: company_name,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        address: address,
        days_of_absence: days_of_absence,
        department: department,
        is_edu_program: is_edu_program == "Evet" ? true : false,
        intern_evaluation: intern_evaluation,
        auth_name: auth_name,
        auth_position: auth_position,
        reg_number: reg_number,
        auth_tc_number: auth_tc_number,
        auth_title: auth_title,
      },
    });

    res.status(200).json({
      message: "confidentalReport added successfully",
      confidentalReport,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllConfidentalReports = async (req, res, next) => {
  try {
    const confidentalReports = await prisma.confidentalReport.findMany();
    res
      .status(200)
      .json({ data: confidentalReports, dataLenth: confidentalReports.length });
  } catch (e) {
    next(e);
  }
};

export const updateConfidentalReport = async (req, res, next) => {
  try {
    const confidentalReportId = req.params.confidentalReportId;
    console.log("burası confidental update");
    const {
      school_number,
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
        school_number: "123123",
        company_name: company_name,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        address: address,
        days_of_absence: days_of_absence,
        department: department,
        is_edu_program: is_edu_program == "Evet" ? true : false,
        intern_evaluation: intern_evaluation,
        auth_name: auth_name,
        auth_position: auth_position,
        reg_number: reg_number,
        auth_tc_number: auth_tc_number,
        auth_title: auth_title,
      },
    });

    res.status(200).json({
      message: "confidentalReport has been updated succesfully",
      updatedConfidentalReport,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteConfidentalReport = async (req, res, next) => {
  try {
    const confidentalReportId = req.params.confidentalReportId;

    await prisma.confidentalReport.delete({
      where: { id: confidentalReportId },
    });
    res.status(200).json({ message: "confidentalReport deleted succesfully" });
  } catch (e) {
    next(e);
  }
};

export const getSingleConfidentalReport = async (req, res, next) => {
  try {
    const confidentalReportId = req.params.confidentalReportId;
    const confidentalReport = await prisma.confidentalReport.findUnique({
      where: { id: confidentalReportId },
    });
    res.status(200).json(confidentalReport);
  } catch (e) {
    next(e);
  }
};
