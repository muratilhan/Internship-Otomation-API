import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../db";

export const comparePasswords = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};

export const handleLogin = async (req, res) => {
  const cookies = req.cookies;
  const { email, password } = req.body;
  console.log("login cookie", cookies && cookies.jwt);

  const foundUser = await prisma.user.findFirst({
    where: { email: email },
  });
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const roles = foundUser.user_type;
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser.id,
          email: foundUser.email,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );
    const newRefreshToken = jwt.sign(
      { id: foundUser.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

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
        console.log("attempted refresh token reuse at login!");
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

    console.log(result);
    console.log(roles);

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send authorization roles and access token to user
    res.json({ roles, accessToken });
  } else {
    res.sendStatus(401);
  }
};
