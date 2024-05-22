import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import InternStatus, { InternStatusLabels } from "../../enums/internStatus";
import { BadRequestError } from "../../errors/BadRequestError";
import { formatDate } from "../../handlers/dates.handler";
import { releatedRecordQueryControl } from "../../handlers/query.handler";
import ExcelJS from "exceljs";

export const getInternStatuses = async (req, res, next) => {
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
    const { eduYearId, studentId, comissionId, status } = req.query;

    const internStatuses = await prisma.internStatus.findMany({
      take: Number(pageSize) || 10,
      skip: Number(page) * Number(pageSize) || undefined,
      select: {
        id: true,
        status: true,
        form: {
          select: {
            id: true,
            start_date: true,
            end_date: true,
            edu_year: {
              select: {
                name: true,
              },
            },
            follow_up: {
              select: {
                name: true,
                last_name: true,
              },
            },
          },
        },
        interview: {
          select: {
            id: true,
            comission: {
              select: {
                name: true,
                last_name: true,
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
      },
      orderBy: [{ [sortedBy]: sortedWay }],
      where: {
        student: recordControl,
        AND: [
          studentId
            ? {
                student: {
                  id: {
                    contains: studentId,
                  },
                },
              }
            : {},
          eduYearId
            ? {
                form: {
                  edu_year: {
                    id: {
                      equals: eduYearId * 1 || undefined,
                    },
                  },
                },
              }
            : {},
          comissionId
            ? {
                interview: {
                  comission: {
                    id: {
                      contains: comissionId,
                    },
                  },
                },
              }
            : {},
          status ? { status: status } : {},
        ],
      },
    });

    const internStatusesCount = await prisma.internStatus.count({
      where: {
        student: recordControl,
        AND: [
          studentId
            ? {
                student: {
                  id: {
                    contains: studentId,
                  },
                },
              }
            : {},
          eduYearId
            ? {
                form: {
                  edu_year: {
                    id: {
                      equals: eduYearId * 1 || undefined,
                    },
                  },
                },
              }
            : {},
          comissionId
            ? {
                interview: {
                  comission: {
                    id: {
                      contains: comissionId,
                    },
                  },
                },
              }
            : {},
          status ? { status: status } : {},
        ],
      },
    });

    return res
      .status(200)
      .json({ data: internStatuses, dataLength: internStatusesCount });
  } catch (error) {
    next(error);
  }
};

export const getInternStatusById = async (req, res, next) => {
  try {
    const internStatusId = req.params.internStatusId;

    const selectUserTag = { select: { id: true, name: true, last_name: true } };

    const internStatus = await prisma.internStatus.findUnique({
      where: {
        id: internStatusId,
      },
      select: {
        id: true,
        createdAt: true,
        createdBy: selectUserTag,
        updatedAt: true,
        updatedBy: selectUserTag,

        interview_id: true,
        form_id: true,

        student: {
          select: {
            id: true,
            name: true,
            last_name: true,
            school_number: true,
            tc_number: true,
          },
        },
        status: true,
        internStatusTracks: {
          where: {
            internStatusId: internStatusId,
          },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            createdAt: true,
            createdBy: selectUserTag,
            prevStatus: true,
            nextStatus: true,
            desc: true,
          },
        },

        form: {
          select: {
            id: true,
            follow_up: {
              select: {
                name: true,
                last_name: true,
              },
            },
          },
        },
        interview: {
          select: {
            id: true,
            date: true,
            comission: {
              select: {
                name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({ data: internStatus });
  } catch (error) {
    next(error);
  }
};

export const updateInternStatus = async (req, res, next) => {
  try {
    const userId = req.id;

    const internStatusId = req.params.internStatusId;

    const { status, desc } = req.body;

    const internStatus = await prisma.internStatus.findUnique({
      where: {
        id: internStatusId,
      },
      select: {
        id: true,
        status: true,
        interview: {
          select: {
            survey: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!internStatus) {
      throw new BadRequestError(errorCodes.NOT_FOUND);
    }

    if (desc) {
      const newInternStatusTrack = await prisma.internStatusTrack.create({
        data: {
          createdBy: {
            connect: {
              id: userId,
            },
          },
          prevStatus: internStatus.status,
          nextStatus: status,
          desc: desc,
          internStatus: {
            connect: {
              id: internStatus.id,
            },
          },
        },
      });
    }

    let sealForm = {};
    let sealSurvey = {};

    if (internStatus.status === InternStatus.FRM01) {
      sealForm = {
        update: {
          data: {
            isSealed: true,
          },
        },
      };
    }

    if (
      internStatus.status === InternStatus.MLK01 &&
      (status === InternStatus.MLK03 || status === InternStatus.MLK02)
    ) {
      if (internStatus?.interview?.survey?.id) {
        sealSurvey = {
          update: {
            survey: {
              update: {
                data: {
                  isSealed: true,
                },
              },
            },
          },
        };
      }
    }

    const updatedForm = await prisma.internStatus.update({
      where: {
        id: internStatusId,
      },
      data: {
        updatedBy: {
          connect: {
            id: userId,
          },
        },
        status: status,
        form: sealForm,
        interview: sealSurvey,
      },
    });

    res.status(200).json({ message: "intern status updated succesfully" });
  } catch (error) {
    next(error);
  }
};

export const getInternStatusAC = async (req, res, next) => {
  try {
    const selectStudentTag = {
      select: { id: true, name: true, last_name: true, school_number: true },
    };
    const internStatuses = await prisma.internStatus.findMany({
      where: {
        status: {
          equals: InternStatus.FRM03,
        },
      },
      select: {
        id: true,
        student: selectStudentTag,
        status: true,
        form: {
          select: {
            start_date: true,
            end_date: true,
            company_info: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const modifiedInternForms = internStatuses
      .filter((internStatus) => internStatus.form)
      .map((internStatus) => ({
        id: internStatus.id,
        label: `${internStatus.student.name} ${internStatus.student.last_name}`,
        subtext: `${internStatus.student.school_number || ""}\n${formatDate(
          internStatus.form.start_date
        )} - ${formatDate(internStatus.form.end_date)}\n${
          internStatus.form?.company_info?.name || ""
        }`,
        translate: internStatus.status,
      }));

    res.status(200).json({ data: modifiedInternForms || [] });
  } catch (error) {
    next(error);
  }
};

export const downloadExcelList = async (req, res, next) => {
  try {
    // 1. Prisma ile veritabanından verileri çek
    const data = await prisma.internStatus.findMany({
      select: {
        id: true,
        status: true,
        form: {
          select: {
            id: true,
            start_date: true,
            end_date: true,
            edu_year: {
              select: {
                name: true,
              },
            },
            follow_up: {
              select: {
                name: true,
                last_name: true,
              },
            },
          },
        },
        interview: {
          select: {
            id: true,
            comission: {
              select: {
                name: true,
                last_name: true,
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
      },
    });

    // 2. Yeni bir Excel çalışma kitabı oluştur
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("InternStatus");

    // 3. Başlıkları ekle
    worksheet.columns = [
      { header: "Öğrenci", key: "student", width: 30 },
      { header: "Form Yetkilisi", key: "followUp", width: 30 },
      { header: "Mülakat Yetkilisi", key: "comission", width: 30 },
      { header: "Staj Durumu", key: "status", width: 40 },
      { header: "Staj Başlangıç Tarihi", key: "startDate", width: 30 },
      { header: "Staj Bitiş Tarihi", key: "endDate", width: 30 },
      { header: "Staj Dönemi", key: "eduYear", width: 30 },
    ];

    // 4. Verileri ekle
    data.forEach((item) => {
      worksheet.addRow({
        student: item.student.name + " " + item.student.last_name,
        followUp:
          item.form.follow_up.name + " " + item.form.follow_up.last_name,
        comission: item?.interview?.id
          ? item.interview.comission.name +
            " " +
            item.interview.comission.last_name
          : "",
        status: InternStatusLabels[item.status].label,
        startDate: new Date(item.form.start_date).toLocaleDateString("tr-TR"),
        endDate: new Date(item.form.end_date).toLocaleDateString("tr-TR"),
        eduYear: item.form.edu_year.name,
      });
    });

    worksheet.columns.forEach((column) => {
      if (column.key === "startDate" || column.key === "endDate") {
        column.style = { numFmt: "DD.MM.YYYY" }; // Tarih formatı
      }
    });

    worksheet.getRow(1).font = { bold: true, size: 15 };

    // 5. Dosyayı kaydet
    await workbook.xlsx.writeFile("data.xlsx");

    res.download("data.xlsx", "data.xlsx", (err) => {
      if (err) {
        console.error("Error downloading the file:", err);
        res.status(500).send("Error downloading the file");
      }
    });
  } catch (error) {
    next(error);
  }
};
