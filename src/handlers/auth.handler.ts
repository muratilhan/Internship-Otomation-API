import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const comparePasswords = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};

export const generateAccesToken = async (id, email, roles) => {
  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: id,
        email: email,
        roles: roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "20m" }
  );
  return accessToken;
};

export const generateRefreshToken = async (id) => {
  const refreshToken = jwt.sign({ id: id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "2d",
  });

  return refreshToken;
};

export const generatePasswordChangeToken = async (email, id) => {
  const passwordRefreshToken = jwt.sign(
    { id: id, email: email },
    process.env.PASSWORD_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
  return passwordRefreshToken;
};

export const generateCompanyConfidentalReportToken = async (
  interviewId,
  studentId
) => {
  const companyConfidentalReportToken = jwt.sign(
    { id: interviewId, studentId: studentId },
    process.env.COMPANY_CONFIDENTAL_TOKEN,
    {
      expiresIn: "2d",
    }
  );
  return companyConfidentalReportToken;
};
