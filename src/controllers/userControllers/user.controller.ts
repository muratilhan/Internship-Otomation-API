import UserRoles from "../../config/rolesList";
import prisma from "../../db";
import * as bcrypt from "bcrypt";
import { BadRequestError } from "../../errors/BadRequestError";
import errorCodes from "../../enums/errorCodes";
import { generatePasswordChangeToken } from "../../handlers/auth.handler";
import { sendEmail } from "../../handlers/email.handler";
import { releatedRecordQueryControl } from "../../handlers/query.handler";
import ExcelJS from "exceljs";

export const getUsers = async (req, res, next) => {
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
    const { createdBy, schoolNumber, userType, name, last_name, isGraduate } =
      req.query;

    const users = await prisma.user.findMany({
      take: Number(pageSize) || 10,
      skip: Number(page) * Number(pageSize) || 0,
      select: {
        id: true,
        createdAt: true,
        name: true,
        last_name: true,
        user_type: true,
        tc_number: true,
        school_number: true,
      },
      orderBy: [{ [sortedBy]: sortedWay }],
      where: {
        school_number: {
          contains: schoolNumber,
        },
        isGraduate: {
          equals: isGraduate === "true" ? true : false,
        },
        user_type: userType,
        name: {
          contains: name,
        },
        last_name: {
          contains: last_name,
        },
        createdBy: createdBy,
      },
    });

    const userCount = await prisma.user.count({
      where: {
        isDeleted: false,
        school_number: {
          contains: schoolNumber,
        },
        isGraduate: {
          equals: isGraduate === "true" ? true : false,
        },
        user_type: userType,
        name: {
          contains: name,
        },
        last_name: {
          contains: last_name,
        },
        createdBy: createdBy,
      },
    });

    res.status(200).json({ data: users, dataLength: userCount });
  } catch (e) {
    next(e);
  }
};

export const addUser = async (req, res, next) => {
  try {
    const adminId = req.id;
    const { email, name, lastName, userType, schoolNumber, tcNumber } =
      req.body;

    const randomString = Math.random().toString(36).substring(2);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        name: name,
        last_name: lastName,
        password: await bcrypt.hash(randomString, 10),
        createdBy: {
          connect: {
            id: adminId,
          },
        },
        user_type: userType,
        school_number: schoolNumber,
        tc_number: tcNumber,
      },
    });

    const passwordRefreshToken = await generatePasswordChangeToken(
      newUser.email,
      newUser.id
    );

    await prisma.user.update({
      where: { id: newUser.id },
      data: { passwordChangeToken: passwordRefreshToken },
    });

    const link = `${process.env.CLIENT_URL}/password-reset/${passwordRefreshToken}`;
    await sendEmail(newUser.email, "Şifre Oluşturma", "signUp", {
      link: link,
      name: newUser.name,
      lastName: newUser.last_name,
    });

    res.status(200).json({ message: "User created succesfully" });
  } catch (e) {
    next(e);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const adminId = req.id;

    const {
      name,
      lastName,
      userType,
      schoolNumber,
      tcNumber,
      isGraduate,
      graduationDate,
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name,
        last_name: lastName,
        updatedBy: {
          connect: {
            id: adminId,
          },
        },
        user_type: userType,
        school_number: schoolNumber,
        tc_number: tcNumber,
        isGraduate: isGraduate,
        graduationDate: graduationDate,
      },
    });

    return res.status(200).json({ message: "User updated succesfully" });
  } catch (error) {
    next(error);
  }
};

export const addMultipleUser = async (req, res, next) => {
  try {
    const adminId = req.id;
    const { userList } = req.body;

    const randomString = Math.random().toString(36).substring(2);

    const userDataPromises = userList.map(async (user) => {
      return {
        school_number: user.schoolNumber,
        email: user.email,
        name: user.name,
        last_name: user.lastName,
        password: await bcrypt.hash(randomString, 10),
        createdby: adminId,
        user_type: user.userType,
      };
    });

    const userData = await Promise.all(userDataPromises);

    const newUsers = await prisma.user.createMany({
      data: userData,
      skipDuplicates: true,
    });
    res.status(200).json({ message: "Users created succesfully" });
  } catch (e) {
    next(e);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const selectUserTag = { select: { id: true, name: true, last_name: true } };

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,

        createdAt: true,
        createdBy: selectUserTag,
        updatedAt: true,
        updatedBy: selectUserTag,

        name: true,
        last_name: true,
        email: true,
        user_type: true,
        school_number: true,
        tc_number: true,
        isGraduate: true,
        graduationDate: true,

        InternStatus: {
          select: {
            id: true,
            status: true,
            student: selectUserTag,
            interview: {
              select: {
                comission: selectUserTag,
              },
            },
            form: {
              select: {
                id: true,
                follow_up: selectUserTag,
                start_date: true,
                total_work_day: true,
                end_date: true,
                company_info: {
                  select: {
                    name: true,
                    service_area: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.status(200).json({ data: user });
  } catch (e) {
    next(e);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const deletedRecord = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!deletedRecord) {
      throw new BadRequestError(errorCodes.NOT_FOUND);
    }

    await prisma.interview.updateMany({
      where: {
        AND: [
          { comission_id: userId },
          {
            student_id: userId,
          },
        ],
      },
      data: {
        isDeleted: true,
      },
    });

    await prisma.internStatus.updateMany({
      where: {
        AND: [
          {
            student_id: userId,
          },
        ],
      },
      data: {
        isDeleted: true,
      },
    });

    await prisma.internForm.updateMany({
      where: {
        AND: [
          { student_id: userId },
          {
            follow_up_id: userId,
          },
        ],
      },
      data: {
        isDeleted: true,
      },
    });

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isDeleted: true,
      },
    });

    res.status(200).json({ message: "User deleted" });
  } catch (e) {
    next(e);
  }
};

export const getStudentAC = async (req, res, next) => {
  try {
    const userId = req.id;
    const userRole = req.roles;

    const students = await prisma.user.findMany({
      where: {
        AND: [
          {
            user_type: UserRoles.student,
          },
          {
            isGraduate: false,
          },
          userRole === UserRoles.student
            ? {
                id: {
                  equals: userId,
                },
              }
            : {},
        ],
      },
      select: {
        name: true,
        last_name: true,
        id: true,
        school_number: true,
      },
    });

    console.log("students", students);

    const modifiedStudents = students.map((student) => ({
      id: student.id,
      label: `${student.name} ${student.last_name}`,
      subtext: student.school_number ? student.school_number : "",
    }));

    res.status(200).json({ data: modifiedStudents || [] });
  } catch (error) {
    next(error);
  }
};

export const getComissionAC = async (req, res, next) => {
  try {
    const comissions = await prisma.user.findMany({
      where: { user_type: UserRoles.comission },
      select: {
        name: true,
        last_name: true,
        id: true,
        user_type: true,
      },
    });

    const admins = await prisma.user.findMany({
      where: { user_type: UserRoles.admin },
      select: {
        name: true,
        last_name: true,
        id: true,
        user_type: true,
      },
    });

    const users = comissions.concat(admins);

    const modifiedComissions = users.map((user) => ({
      id: user.id,
      label: `${user.name} ${user.last_name}`,
      subtext: user.user_type ? user.user_type : "",
    }));

    res.status(200).json({ data: modifiedComissions || [] });
  } catch (error) {
    next(error);
  }
};

export const downloadExcelListGraduated = async (req, res, next) => {
  try {
    // 1. Prisma ile veritabanından verileri çek
    const data = await prisma.user.findMany({
      where: {
        isGraduate: {
          equals: true,
        },
      },
      select: {
        id: true,
        createdAt: true,
        name: true,
        last_name: true,
        user_type: true,
        tc_number: true,
        school_number: true,
        graduationDate: true,
      },
    });

    // 2. Yeni bir Excel çalışma kitabı oluştur
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("StajınıTamamlamışÖğrenciler");

    // 3. Başlıkları ekle
    worksheet.columns = [
      { header: "Öğrenci Oluşturulma Tarihi", key: "createdAt", width: 40 },
      { header: "Öğrenci İsim", key: "name", width: 30 },
      { header: "Öğrenci Soyisim", key: "lastName", width: 30 },
      { header: "Öğrenci Numarası", key: "schoolNumber", width: 30 },
      { header: "T.C Kimlik Numarası", key: "tcNumber", width: 30 },
      { header: "Staj Tamamlama Tarihi", key: "graduationDate", width: 30 },
    ];

    // 4. Verileri ekle
    data.forEach((item) => {
      worksheet.addRow({
        createdAt: new Date(item?.createdAt).toLocaleDateString("tr-TR"),
        schoolNumber: item?.school_number,
        name: item?.name,
        lastName: item?.last_name,
        tcNumber: item?.tc_number,
        graduationDate: new Date(item?.graduationDate).toLocaleDateString(
          "tr-TR"
        ),
      });
    });

    worksheet.columns.forEach((column) => {
      if (column.key === "graduationDate" || column.key === "createdAt") {
        column.style = { numFmt: "DD.MM.YYYY" }; // Tarih formatı
      }
    });

    worksheet.getRow(1).font = { bold: true, size: 15 };

    // 5. Dosyayı kaydet
    await workbook.xlsx.writeFile("user.xlsx");

    res.download("user.xlsx", "user.xlsx", (err) => {
      if (err) {
        console.error("Error downloading the file:", err);
        res.status(500).send("Error downloading the file");
      }
    });
  } catch (error) {
    next(error);
  }
};
