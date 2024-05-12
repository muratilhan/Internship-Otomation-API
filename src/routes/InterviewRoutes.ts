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

const InterviewRouter = express.Router();

InterviewRouter.get("/get", getInterviews);

InterviewRouter.get("/get/:interviewId", getInterviewById);

InterviewRouter.post("/add", addNewInterview);

InterviewRouter.put("/update/:interviewId", updateInterview);

InterviewRouter.delete("/delete/:interviewId", deleteInterview);

// AC
InterviewRouter.get("/autocomplete", getInterviewAC);

// Company Confidental Report
InterviewRouter.post(
  "/sendCompanyConfidental",
  sendCompanyConfidentalReportToken
);

export default InterviewRouter;
