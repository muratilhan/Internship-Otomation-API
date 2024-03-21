import express from "express";
import { validateRequestSchema } from "../middlewares/validationHandler.middleware";
import { signinSchema } from "../validations/signin.schema";
import { handleLogin } from "../controllers/authControllers/auth.controller";
import { handleNewUser } from "../controllers/authControllers/register.controller";
import { handleRefreshToken } from "../controllers/authControllers/refreshToken.controller";
import { handleLogout } from "../controllers/authControllers/logout.controller";

const userRouter = express.Router();

userRouter.post("/signin", signinSchema, validateRequestSchema, handleLogin);

userRouter.post("/signup", handleNewUser);

userRouter.post("/token", handleRefreshToken);

userRouter.post("/logout", handleLogout);

export default userRouter;
