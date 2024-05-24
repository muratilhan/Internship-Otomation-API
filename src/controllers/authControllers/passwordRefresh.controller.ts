import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { BadRequestError } from "../../errors/BadRequestError";
import {
  generatePasswordChangeToken,
  hashPassword,
} from "../../handlers/auth.handler";
import { sendEmail } from "../../handlers/email.handler";
import jwt from "jsonwebtoken";

export const sendPasswordRefresh = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) throw new BadRequestError(errorCodes.EMAIL_NOT_FOUND);

    const passwordRefreshToken = await generatePasswordChangeToken(
      user.email,
      user.id
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordChangeToken: passwordRefreshToken },
    });

    const link = `${process.env.CLIENT_URL}/password-reset/${passwordRefreshToken}`;
    await sendEmail(user.email, "Şifre Yenileme", "passwordReset", {
      link: link,
      name: user.name,
      lastName: user.last_name,
    });

    res.send("password reset link sent to your email account");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    // extract userId from token
    let userId = "";

    jwt.verify(
      req.params.token,
      process.env.PASSWORD_REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) throw new BadRequestError(errorCodes.NOT_VALID_LINK);
        userId = decoded.id;
      }
    );

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestError(errorCodes.NOT_VALID_LINK);

    const token = await prisma.user.findFirst({
      where: { id: userId, passwordChangeToken: req.params.token },
    });
    if (!token) throw new BadRequestError(errorCodes.NOT_VALID_LINK);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordChangeToken: "", password: await hashPassword(password) },
    });

    res.status(200).json({ message: "password reset sucessfully." });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
