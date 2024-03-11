import express from "express";
import { createNewUser, signin } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/signin", signin);

userRouter.post("/signup", createNewUser);

export default userRouter;
