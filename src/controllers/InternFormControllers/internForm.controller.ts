import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { BadRequestError } from "../../errors/BadRequestError";

export const addNewForm = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.body;

    res.status(201).json({ message: "User succesfully created" });
  } catch (e) {
    next(e);
  }
};
