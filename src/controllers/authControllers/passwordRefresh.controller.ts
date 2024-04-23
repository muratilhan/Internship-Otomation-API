import prisma from "../../db";
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
    if (!user)
      return res.status(400).send("user with given email doesn't exist");

    const passwordRefreshToken = await generatePasswordChangeToken(
      user.email,
      user.id
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordChangeToken: passwordRefreshToken },
    });

    const link = `${process.env.CLIENT_URL}/password-reset/${passwordRefreshToken}`;
    await sendEmail(user.email, "Password reset", link);

    res.send("password reset link sent to your email account");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    // TODO: maybe later we will implement a 2nd password match :D
    const { password } = req.body;

    // extract userId from token
    let userId = "";

    jwt.verify(
      req.params.token,
      process.env.PASSWORD_REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403); //invalid token
        userId = decoded.id;
      }
    );

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(400).send("invalid link or expired");

    const token = await prisma.user.findFirst({
      where: { id: userId, passwordChangeToken: req.params.token },
    });
    if (!token) return res.status(400).send("Invalid link or expired");

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordChangeToken: "", password: await hashPassword(password) },
    });

    res.send("password reset sucessfully.");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
