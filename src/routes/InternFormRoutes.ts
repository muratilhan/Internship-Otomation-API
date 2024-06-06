import express from "express";
import { validateRequestSchema } from "../middlewares/validationHandler.middleware";
import { protect } from "../middlewares/auth.middleware";
import {
  addForm,
  deleteForm,
  getFormById,
  getForms,
  getInternFormAC,
  unlockInternFormSeal,
  updateForm,
} from "../controllers/internFormControllers/internForm.controller";
import {
  addStudentInfo,
  updateStudentInfo,
} from "../controllers/internFormControllers/studentInfo.controller";
import {
  addCompanyInfo,
  updateCompanyInfo,
} from "../controllers/internFormControllers/companyInfo.controller";
import { verifyRoles } from "../middlewares/permission.middleware";
import UserRoles from "../config/rolesList";

const InternFormRouter = express.Router();

InternFormRouter.get("/get", verifyRoles(UserRoles.student), getForms);
InternFormRouter.post("/add", verifyRoles(UserRoles.student), addForm);
InternFormRouter.get(
  "/get/:internFormId",
  verifyRoles(UserRoles.student),
  getFormById
);
InternFormRouter.put(
  "/update/:internFormId",
  verifyRoles(UserRoles.student),
  updateForm
);
InternFormRouter.delete(
  "/delete/:internFormId",
  verifyRoles(UserRoles.comission),
  deleteForm
);

// Student Info
InternFormRouter.post(
  "/student-info/add",
  verifyRoles(UserRoles.student),
  addStudentInfo
);
InternFormRouter.put(
  "/student-info/update/:studentInfoId",
  verifyRoles(UserRoles.student),
  updateStudentInfo
);
// Company Info
InternFormRouter.post(
  "/company-info/add",
  verifyRoles(UserRoles.student),
  addCompanyInfo
);
InternFormRouter.put(
  "/company-info/update/:companyInfoId",
  verifyRoles(UserRoles.student),
  updateCompanyInfo
);

// AC
InternFormRouter.get("/autocomplete", getInternFormAC);

InternFormRouter.put(
  "/unlock/:internFormId",
  verifyRoles(UserRoles.comission),
  unlockInternFormSeal
);

export default InternFormRouter;
