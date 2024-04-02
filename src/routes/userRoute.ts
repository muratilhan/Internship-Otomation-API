import express from "express";
import {
  addMultipleUser,
  addUser,
  deleteUserById,
  getUserById,
  getUsers,
} from "../controllers/userControllers/user.controller";
import { validateRequestSchema } from "../middlewares/validationHandler.middleware";
import { addUserSchema } from "../validations/user/addUser.schema";
import { addMultipleUserSchema } from "../validations/user/addMultipleUser.schema";

const userRouter = express.Router();

userRouter.get("/get", getUsers);
userRouter.post("/add", addUserSchema, validateRequestSchema, addUser);
userRouter.post(
  "/multipleadd",
  addMultipleUserSchema,
  validateRequestSchema,
  addMultipleUser
);
userRouter.get("/get/:userId", getUserById);
userRouter.delete("/delete/:userId", deleteUserById);

export default userRouter;
