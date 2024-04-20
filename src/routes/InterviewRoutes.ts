import express from "express";
import {
  addNewInterview,
  getInterviewById,
  getInterviews,
  updateInterview,
} from "../controllers/interviewControllers/interview.controller";

const InterviewRouter = express.Router();

InterviewRouter.get("/get", getInterviews);

InterviewRouter.get("/get/:interviewId", getInterviewById);

InterviewRouter.post("/add", addNewInterview);

InterviewRouter.put("/update/:interviewId", updateInterview);

InterviewRouter.delete("/delete/:interviewId");

// AC
InterviewRouter.get("/autocomplete");

export default InterviewRouter;
