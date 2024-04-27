import UserRoles from "../../config/rolesList";
import prisma from "../../db";
import * as bcrypt from "bcrypt";

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
    const { createdBy, schoolNumber, userType, name } = req.query;

    const users = await prisma.user.findMany({
      take: Number(pageSize) || 10,
      skip: Number(page) * Number(pageSize) || undefined,
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
        user_type: userType,
        name: {
          contains: name,
        },
        createdby: createdBy,
      },
    });

    res.status(200).json({ data: users, dataLength: users.length });
  } catch (e) {
    next(e);
  }
};

export const addUser = async (req, res, next) => {
  try {
    const adminId = req.id;
    const { schoolNumber, email, name, lastName, userType } = req.body;

    const randomString = Math.random().toString(36).substring(2);

    const newUser = await prisma.user.create({
      data: {
        school_number: schoolNumber,
        email: email,
        name: name,
        last_name: lastName,
        password: await bcrypt.hash(randomString, 10),
        createdby: adminId,
        user_type: userType,
      },
    });

    res.status(200).json({ message: "User created succesfully" });
  } catch (e) {
    next(e);
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

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
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

    const user = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    res.status(200).json({ message: "User deleted" });
  } catch (e) {
    next(e);
  }
};

export const getStudentAC = async (req, res, next) => {
  try {
    const students = await prisma.user.findMany({
      where: { user_type: UserRoles.student },
      select: {
        name: true,
        last_name: true,
        id: true,
        school_number: true,
      },
    });

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
        school_number: true,
      },
    });

    const modifiedComissions = comissions.map((user) => ({
      id: user.id,
      label: `${user.name} ${user.last_name}`,
      subtext: user.school_number ? user.school_number : "",
    }));

    res.status(200).json({ data: modifiedComissions || [] });
  } catch (error) {
    next(error);
  }
};
