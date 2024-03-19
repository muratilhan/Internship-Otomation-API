import express from "express";
import { createNewUser, signin } from "../controllers/userController";
import { validateRequestSchema } from "../middlewares/validationHandler.middleware";
import { signinSchema } from "../validations/signin.schema";

const userRouter = express.Router();

userRouter.post("/signin", signinSchema, validateRequestSchema, signin);

userRouter.post("/signup", createNewUser);

export default userRouter;
