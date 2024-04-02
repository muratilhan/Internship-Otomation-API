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
    const { createdBy, studentId, userType, name } = req.query;

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
        student_id: true,
      },
      orderBy: [{ [sortedBy]: sortedWay }],
      where: {
        student_id: {
          contains: studentId,
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
    const { studentId, email, name, lastName, userType } = req.body;

    const randomString = Math.random().toString(36).substring(2);

    const newUser = await prisma.user.create({
      data: {
        student_id: studentId,
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
        student_id: user.studentId,
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
