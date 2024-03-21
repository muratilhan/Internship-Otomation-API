import prisma from "../../db";
import jwt from "jsonwebtoken";

export const handleRefreshToken = async (req, res, next) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) {
    res.status(401);
    res.send("Not authorized22");
    return;
  }

  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  const foundUser = await prisma.user.findFirst({
    where: { refreshToken: { has: refreshToken } },
  });

  console.log("foundUser--", foundUser);
  // Detected refresh token reuse
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);

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
      if (err || foundUser.id !== decoded.id) return res.sendStatus(403);

      // refresh token was still valid
      const roles = foundUser.user_type;

      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: decoded.id,
            email: decoded.email,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10s" }
      );

      const newRefreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

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
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ roles, accessToken });
    }
  );
};
