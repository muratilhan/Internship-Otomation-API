import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { BadRequestError } from "../../errors/BadRequestError";
import { generateCompanyConfidentalReportToken } from "../../handlers/auth.handler";
import { formatDate, isSameDay } from "../../handlers/dates.handler";
import { sendEmail } from "../../handlers/email.handler";
import jwt from "jsonwebtoken";

export const sendCompanyConfidentalReportToken = async (req, res, next) => {
  try {
    const { interviewId } = req.body;
    const userId = req.id;

    await prisma.$transaction(
      async (prisma) => {
        const interview = await prisma.interview.findUnique({
          where: {
            id: interviewId,
          },
        });

        if (!interview) {
          throw new BadRequestError(errorCodes.NOT_FOUND);
        }

        const toDay = new Date();
        const lastDateOfMailSended = interview.lastDateOfMailSended;

        if (lastDateOfMailSended && isSameDay(lastDateOfMailSended, toDay)) {
          throw new BadRequestError(errorCodes.CR_MAIL_SENDED);
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

        const confidentalReportToken =
          await generateCompanyConfidentalReportToken(
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
                start_date: true,
                end_date: true,
                student: {
                  select: {
                    name: true,
                    last_name: true,
                    school_number: true,
                  },
                },
                company_info: {
                  select: {
                    email: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

        await prisma.interview.update({
          where: {
            id: interviewId,
          },
          data: {
            updatedBy: {
              connect: {
                id: userId,
              },
            },
            lastDateOfMailSended: new Date(),
            companyAccesToken: confidentalReportToken,
          },
        });

        console.log("companyEmail", email);

        const link = `${process.env.CLIENT_URL}/company/confidential-report/${confidentalReportToken}`;
        await sendEmail(
          email.form.company_info.email,
          "Gizli Sicil Fişi",
          "companyConfidental",
          {
            link: link,
            startDate: formatDate(email.form.start_date),
            endDate: formatDate(email.form.end_date),
            name: email.form.student.name,
            lastName: email.form.student.last_name,
            schoolNumber: email.form.student.school_number,
            companyName: email.form.company_info.name,
          }
        );
        console.log("link", link);

        res
          .status(200)
          .json({ message: "password reset link sent to company" });
      },
      {
        maxWait: 50000, // default: 2000
        timeout: 100000, // default: 5000
      }
    );
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

    await prisma.$transaction(
      async (prisma) => {
        // verify the token

        jwt.verify(
          confidentalReportToken,
          process.env.COMPANY_CONFIDENTAL_TOKEN,
          (err, decoded) => {
            if (err) {
              return (interviewId = null); //invalid token
            }
            interviewId = decoded.id;
            studentId = decoded.studentId;
          }
        );

        if (!interviewId) {
          throw new BadRequestError(errorCodes.CR_DUPLICATE_TOKEN);
        }

        const interview = await prisma.interview.findUnique({
          where: {
            id: interviewId,
          },
          select: {
            id: true,
            companyAccesToken: true,

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

        console.log("accesToken", interview.companyAccesToken);
        console.log("confidentalReportToken", confidentalReportToken);

        if (interview.companyAccesToken !== confidentalReportToken) {
          throw new BadRequestError(errorCodes.CR_DUPLICATE_TOKEN);
        }

        const internStatus = await prisma.internStatus.findFirst({
          where: {
            interview: {
              id: interview.id,
            },
          },
          select: {
            interview: {
              select: {
                id: true,
                confidentalReport: {
                  select: {
                    id: true,
                    company_name: true,
                    address: true,
                    start_date: true,
                    end_date: true,
                    days_of_absence: true,
                    department: true,
                    is_edu_program: true,
                    intern_evaluation: true,
                    auth_name: true,
                    auth_position: true,
                    reg_number: true,
                    auth_tc_number: true,
                    auth_title: true,
                    desc: true,
                  },
                },
              },
            },
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

        res.status(200).json({ data: internStatus });
      },
      {
        maxWait: 50000, // default: 2000
        timeout: 100000, // default: 5000
      }
    );
  } catch (error) {
    next(error);
  }
};

export const createCompanyConfidentalReport = async (req, res, next) => {
  try {
    const {
      confidentalReportToken,
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
      desc,
    } = req.body;

    // validate the token

    let interviewId = null;
    let studentId = null;

    // verify the token

    jwt.verify(
      confidentalReportToken,
      process.env.COMPANY_CONFIDENTAL_TOKEN,
      (err, decoded) => {
        if (err) {
          return (interviewId = null); //invalid token
        }
        interviewId = decoded.id;
        studentId = decoded.studentId;
      }
    );

    if (!interviewId) {
      throw new BadRequestError(errorCodes.CR_DUPLICATE_TOKEN);
    }

    const confidentalReport = await prisma.confidentalReport.create({
      data: {
        interview: {
          connect: {
            id: interviewId,
          },
        },
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
        desc: desc,
      },
    });

    res.status(200).json({
      // data: confidentalReport,
      message: "confidentalReport added successfully",
    });
  } catch (error) {
    next(error);
  }
};
