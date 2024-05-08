import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { BadRequestError } from "../../errors/BadRequestError";
import { generateCompanyConfidentalReportToken } from "../../handlers/auth.handler";
import { sendEmail } from "../../handlers/email.handler";
import jwt from "jsonwebtoken";

export const sendCompanyConfidentalReportToken = async (req, res, next) => {
  try {
    const { interviewId } = req.body;

    const interview = await prisma.interview.findUnique({
      where: {
        id: interviewId,
      },
    });

    if (!interview) {
      throw new BadRequestError(errorCodes.NOT_FOUND);
    }

    const confidental = await prisma.confidentalReport.findFirst({
      where: {
        interview: {
          id: {
            equals: interviewId,
          },
        },
      },
    });

    if (confidental) {
      throw new BadRequestError(errorCodes.CR_DUPLICATE_MAIL);
    }

    const confidentalReportToken = await generateCompanyConfidentalReportToken(
      interview.id,
      interview.student_id
    );

    const email = await prisma.internStatus.findFirst({
      where: {
        interview: {
          id: {
            contains: interview.id,
          },
        },
      },
      select: {
        form: {
          select: {
            company_info: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    console.log("companyEmail", email);

    const link = `${process.env.CLIENT_URL}/company/confidential-report/${confidentalReportToken}`;
    // await sendEmail(email, "Gizli Sicil Fişi", link);
    console.log("link", link);

    res
      .status(200)
      .json({ message: "password reset link sent to your email account" });
  } catch (error) {
    next(error);
  }
};

export const getCompanyConfidentalReport = async (req, res, next) => {
  try {
    // TODO: getCompanyConfidentalReportToken

    const { confidentalReportToken } = req.params;

    let interviewId = null;
    let studentId = null;

    // verify the token

    jwt.verify(
      confidentalReportToken,
      process.env.COMPANY_CONFIDENTAL_TOKEN,
      (err, decoded) => {
        if (err) return res.sendStatus(403); //invalid token
        interviewId = decoded.id;
        studentId = decoded.studentId;
      }
    );

    const interview = await prisma.interview.findUnique({
      where: {
        id: interviewId,
      },
      select: {
        id: true,

        student: {
          select: {
            id: true,
            name: true,
            last_name: true,
            school_number: true,
            tc_number: true,
          },
        },
      },
    });

    if (!interview) {
      throw new BadRequestError(errorCodes.NOT_FOUND);
    }

    res.status(200).json({ data: interview });

    // return the student data
  } catch (error) {
    next(error);
  }
};

export const createCompanyConfidentalReport = async (req, res, next) => {
  try {
    // TODO: createCompanyConfidentalReport
    const {
      confidentalReportToken,
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

    // validate the token

    const confidentalReport = await prisma.confidentalReport.create({
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

    res.status(200).json({
      data: confidentalReport,
      message: "confidentalReport added successfully",
    });
  } catch (error) {
    next(error);
  }
};
