import prisma from "../../db";

export const logout = async (req, res) => {
  // on client also need delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await prisma.user.findFirst({
    where: { refreshToken: { has: refreshToken } },
  });
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
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
  res.sendStatus(200);
};
