import prisma from "../../db";
import jwt from "jsonwebtoken";
import {
  generateAccesToken,
  generateRefreshToken,
} from "../../handlers/auth.handler";
import { AuthenticationError } from "../../errors/AuthenticationError";
import errorCodes from "../../enums/errorCodes";

export const refreshToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies?.jwt) {
      throw new AuthenticationError(errorCodes.NOT_VALID_REFRESH_TOKEN);
    }

    const refreshToken = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

    const foundUser = await prisma.user.findFirst({
      where: { refreshToken: { has: refreshToken } },
    });

    let JwtError = false;

    console.log("foundUser--", foundUser);
    // Detected refresh token reuse
    if (!foundUser) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) {
            return (JwtError = true);
          }

          console.log("attemted the refresh token reuse");
          const hackedUser = await prisma.user.findFirst({
            where: {
              id: decoded.id,
            },
          });

          const updatedUser = await prisma.user.update({
            where: {
              id: hackedUser.id,
            },
            data: {
              refreshToken: {
                set: [],
              },
            },
          });

          console.log("hacked-user", updatedUser);
        }
      );
    }
    console.log(foundUser.user_type, typeof foundUser.user_type);

    const newRefreshTokenArray = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );

    // evaluate jwt
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          const updatedUser = await prisma.user.update({
            where: {
              id: foundUser.id,
            },
            data: {
              refreshToken: {
                set: [...newRefreshTokenArray],
              },
            },
          });
          console.log("expired refresh token", updatedUser);
        }
        console.log("decoded", decoded);
        if (err || foundUser.id !== decoded.id) {
          return (JwtError = true);
        }

        // refresh token was still valid
        const roles = foundUser.user_type;

        const accessToken = await generateAccesToken(
          decoded.id,
          decoded.email,
          roles
        );

        const newRefreshToken = await generateRefreshToken(foundUser.id);

        // saving refreshToken with current user
        const updatedUser = await prisma.user.update({
          where: {
            id: foundUser.id,
          },
          data: {
            refreshToken: {
              set: [...newRefreshTokenArray, newRefreshToken],
            },
          },
        });

        // Creates Secure cookie with refresh token
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ roles, accessToken });
      }
    );

    if (JwtError) {
      throw new AuthenticationError(errorCodes.NOT_VALID_REFRESH_TOKEN);
    }
  } catch (error) {
    next(error);
  }
};
