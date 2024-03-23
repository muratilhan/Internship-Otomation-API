import express from "express";
import { validateRequestSchema } from "../middlewares/validationHandler.middleware";
import { signinSchema } from "../validations/signin.schema";
import { login } from "../controllers/authControllers/auth.controller";
import { logout } from "../controllers/authControllers/logout.controller";
import { newUser } from "../controllers/authControllers/register.controller";
import { refreshToken } from "../controllers/authControllers/refreshToken.controller";
import {
  changePassword,
  sendPasswordRefresh,
} from "../controllers/authControllers/passwordRefresh.controller";
import { passwordResetSchema } from "../validations/passwordReset.schema";
import { changePasswordSchema } from "../validations/changePassword.schema";

const userRouter = express.Router();

userRouter.post("/signin", signinSchema, validateRequestSchema, login);

userRouter.post("/signup", newUser);

userRouter.post("/token", refreshToken);

userRouter.post("/logout", logout);

userRouter.post(
  "/password-reset",
  passwordResetSchema,
  validateRequestSchema,
  sendPasswordRefresh
);

userRouter.post(
  "/password-reset/:token",
  changePasswordSchema,
  validateRequestSchema,
  changePassword
);

export default userRouter;
