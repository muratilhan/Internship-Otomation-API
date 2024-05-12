import express from "express";
import {
  addMultipleUser,
  addUser,
  deleteUserById,
  getComissionAC,
  getStudentAC,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/userControllers/user.controller";
import { validateRequestSchema } from "../middlewares/validationHandler.middleware";
import { addUserSchema } from "../validations/user/addUser.schema";
import { addMultipleUserSchema } from "../validations/user/addMultipleUser.schema";

const UserRouter = express.Router();

UserRouter.get("/get", getUsers);
UserRouter.post("/add", addUserSchema, validateRequestSchema, addUser);
UserRouter.put("/update/:userId", updateUser);
UserRouter.post(
  "/multipleadd",
  addMultipleUserSchema,
  validateRequestSchema,
  addMultipleUser
);
UserRouter.get("/get/:userId", getUserById);
UserRouter.delete("/delete/:userId", deleteUserById);

// AC
UserRouter.get("/autocomplete/student", getStudentAC);
UserRouter.get("/autocomplete/comission", getComissionAC);

export default UserRouter;
