import express from "express";

const InterviewRouter = express.Router();

InterviewRouter.get("/get");

InterviewRouter.get("/get/:interviewId");

InterviewRouter.post("/add");

InterviewRouter.put("/update/:interviewId");

InterviewRouter.delete("/delete/:interviewId");

export default InterviewRouter;
