import express from "express";
import { validateRequestSchema } from "../middlewares/validationHandler.middleware";
import { protect } from "../middlewares/auth.middleware";
import {
  addForm,
  deleteForm,
  getFormById,
  getForms,
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

const InternFormRouter = express.Router();

InternFormRouter.get("/get", getForms);
InternFormRouter.post("/add", addForm);
InternFormRouter.get("/get/:internFormId", getFormById);
InternFormRouter.put("/update/:internFormId", updateForm);
InternFormRouter.delete("/delete/:internFormId", deleteForm);

// Student Info
InternFormRouter.post("/student-info/add", addStudentInfo);
InternFormRouter.put("/student-info/:studentInfoId", updateStudentInfo);
// Company Info
InternFormRouter.post("/company-info/add", addCompanyInfo);
InternFormRouter.put("/company-info/:companyInfoId", updateCompanyInfo);

export default InternFormRouter;
