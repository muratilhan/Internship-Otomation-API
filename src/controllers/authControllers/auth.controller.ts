import prisma from "../../db";
import errorCodes from "../../enums/errorCodes";
import { AuthenticationError } from "../../errors/AuthenticationError";
import { BadRequestError } from "../../errors/BadRequestError";
import {
  comparePasswords,
  generateAccesToken,
  generateRefreshToken,
} from "../../handlers/auth.handler";

export const login = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { email, password } = req.body;

    const foundUser = await prisma.user.findFirst({
      where: { email: email },
    });
    if (!foundUser) {
      throw new BadRequestError(errorCodes.INVALID_CREDENTIALS);
    }
    // evaluate password
    const match = await comparePasswords(password, foundUser.password);
    if (match) {
      const roles = foundUser.user_type;
      // create JWTs
      const accessToken = await generateAccesToken(
        foundUser.id,
        foundUser.email,
        foundUser.user_type
      );

      const newRefreshToken = await generateRefreshToken(foundUser.id);

      let newRefreshTokenArray = !(cookies && cookies.jwt)
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

      if (cookies && cookies.jwt) {
        /* 
            Scenario added here: 
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
        const refreshToken = cookies.jwt;
        const foundToken = await prisma.user.findFirst({
          where: { refreshToken: { has: refreshToken } },
        });

        // Detected refresh token reuse!
        if (!foundToken) {
          // clear out ALL previous refresh tokens
          newRefreshTokenArray = [];
        }
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
      }

      // Saving refreshToken with current user
      const result = await prisma.user.update({
        where: {
          id: foundUser.id,
        },
        data: {
          refreshToken: {
            set: [...newRefreshTokenArray, newRefreshToken],
          },
        },
      });

      // Creates Secure Cookie with refresh token
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Send authorization roles and access token to user
      res.json({ roles, accessToken });
    } else {
      throw new BadRequestError(errorCodes.INVALID_CREDENTIALS);
    }
  } catch (error) {
    next(error);
  }
};
