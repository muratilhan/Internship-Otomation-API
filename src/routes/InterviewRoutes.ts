import express from "express";
import {
  addNewInterview,
  deleteInterview,
  getInterviewAC,
  getInterviewById,
  getInterviews,
  updateInterview,
} from "../controllers/interviewControllers/interview.controller";
import { sendCompanyConfidentalReportToken } from "../controllers/confidentalReportControllers/companyConfidental.controller";
import { verifyRoles } from "../middlewares/permission.middleware";
import UserRoles from "../config/rolesList";

const InterviewRouter = express.Router();

InterviewRouter.get("/get", verifyRoles(UserRoles.student), getInterviews);

InterviewRouter.get(
  "/get/:interviewId",
  verifyRoles(UserRoles.student),
  getInterviewById
);

InterviewRouter.post("/add", verifyRoles(UserRoles.comission), addNewInterview);

InterviewRouter.put(
  "/update/:interviewId",
  verifyRoles(UserRoles.comission),
  updateInterview
);

InterviewRouter.delete(
  "/delete/:interviewId",
  verifyRoles(UserRoles.comission),
  deleteInterview
);

// AC
InterviewRouter.get(
  "/autocomplete",
  verifyRoles(UserRoles.student),
  getInterviewAC
);

// Company Confidental Report
InterviewRouter.post(
  "/sendCompanyConfidental",
  verifyRoles(UserRoles.student),
  sendCompanyConfidentalReportToken
);

export default InterviewRouter;
