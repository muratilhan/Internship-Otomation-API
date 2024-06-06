import express from "express";
import {
  addUser,
  deleteUserById,
  downloadExcelListGraduated,
  getComissionAC,
  getStudentAC,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/userControllers/user.controller";
import { validateRequestSchema } from "../middlewares/validationHandler.middleware";
import { addUserSchema } from "../validations/user/addUser.schema";
import { verifyRoles } from "../middlewares/permission.middleware";
import UserRoles from "../config/rolesList";

const UserRouter = express.Router();

UserRouter.get("/get", verifyRoles(UserRoles.comission), getUsers);
UserRouter.post(
  "/add",
  verifyRoles(UserRoles.comission),
  addUserSchema,
  validateRequestSchema,
  addUser
);
UserRouter.put("/update/:userId", verifyRoles(UserRoles.comission), updateUser);

UserRouter.get("/get/:userId", verifyRoles(UserRoles.comission), getUserById);
UserRouter.delete(
  "/delete/:userId",
  verifyRoles(UserRoles.comission),
  deleteUserById
);

// AC
UserRouter.get("/autocomplete/student", getStudentAC);
UserRouter.get("/autocomplete/comission", getComissionAC);

// graduate Excel
UserRouter.post(
  "/download/excel",
  verifyRoles(UserRoles.comission),
  downloadExcelListGraduated
);

export default UserRouter;
