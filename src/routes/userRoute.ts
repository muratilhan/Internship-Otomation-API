import express from "express";
import {
  addMultipleUser,
  addUser,
  deleteUserById,
  getUserById,
  getUsers,
} from "../controllers/userControllers/user.controller";

const userRouter = express.Router();

userRouter.get("/get", getUsers);
userRouter.post("/add", addUser);
userRouter.post("/multipleadd", addMultipleUser);
userRouter.get("/:userId", getUserById);
userRouter.delete("/delete/:userId", deleteUserById);

export default userRouter;
