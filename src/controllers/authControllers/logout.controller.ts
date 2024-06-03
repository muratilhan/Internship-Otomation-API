import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import resultCodes from "../../enums/resultCodes";
import { AuthenticationError } from "../../errors/AuthenticationError";
import { BadRequestError } from "../../errors/BadRequestError";

export const logout = async (req, res, next) => {
  try {
    // on client also need delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await prisma.user.findFirst({
      where: { refreshToken: { has: refreshToken } },
    });
    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      throw new AuthenticationError(errorCodes.NOT_FOUND);
    }

    // Delete refreshToken in db
    const updatedUser = await prisma.user.update({
      where: {
        id: foundUser.id,
      },
      data: {
        refreshToken: {
          set: foundUser.refreshToken.filter((token) => token !== refreshToken),
        },
      },
    });

    // Clear client cookie
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.status(200).json({ message: resultCodes.LOGOUT_SUCCESS });
  } catch (error) {
    next(error);
  }
};
