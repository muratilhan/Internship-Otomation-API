import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { BadRequestError } from "../../errors/BadRequestError";
import { generateCompanyConfidentalReportToken } from "../../handlers/auth.handler";
import { sendEmail } from "../../handlers/email.handler";

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

    const newConfidentalReport = await prisma.confidentalReport.create({
      data: {
        interview: {
          connect: {
            id: interview.id,
          },
        },
      },
    });

    const confidentalReportToken = await generateCompanyConfidentalReportToken(
      newConfidentalReport.id,
      interview.student_id
    );

    await prisma.confidentalReport.update({
      where: {
        id: newConfidentalReport.id,
      },
      data: {
        companyAccesToken: confidentalReportToken,
      },
    });

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

    const link = `${process.env.CLIENT_URL}/company/confidential-report//${confidentalReportToken}`;
    // await sendEmail(email, "Gizli Sicil Fişi", link);

    res.send("password reset link sent to your email account");
  } catch (error) {
    next(error);
  }
};

export const getCompanyConfidentalReportToken = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const createCompanyConfidentalReport = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
