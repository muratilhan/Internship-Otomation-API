import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import * as bcrypt from "bcrypt";
import { BadRequestError } from "../../errors/BadRequestError";
import {
  generatePasswordChangeToken,
  hashPassword,
} from "../../handlers/auth.handler";
import { sendEmail } from "../../handlers/email.handler";
import resultCodes from "../../enums/resultCodes";

const emailRegex = /^[0-9]{9}@ogr\.uludag\.edu\.tr$/;

export const newUser = async (req, res, next) => {
  try {
    const isUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (isUser) {
      throw new BadRequestError(errorCodes.USER_ALREADY_SIGNUP);
    }

    const { email, name, lastName, tcNumber } = req.body;

    if (!emailRegex.test(email)) {
      throw new BadRequestError(errorCodes.INVALID_EMAIL);
    }

    const emailNumber = email.split("@")[0];

    const randomString = Math.random().toString(36).substring(2);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        name: name,
        last_name: lastName,
        password: await bcrypt.hash(randomString, 10),
        school_number: emailNumber,
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
    await sendEmail(
      newUser.email,
      "Staj Otomasyonu Şifre Oluşturma",
      "signUp",
      {
        link: link,
        name: newUser.name,
        lastName: newUser.last_name,
      }
    );

    return res.status(200).json({ message: resultCodes.SIGN_UP_SUCCESS });
  } catch (err) {
    next(err);
  }
};
