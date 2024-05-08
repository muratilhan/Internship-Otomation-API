import express from "express";
import {
  getFormsCount,
  getInterviewsCount,
  getStudentActiveInternship,
} from "../controllers/dashboardControllers/dahboard.controller";

const DashboardRouter = express.Router();

// TODO: dashboard services
DashboardRouter.get("/interviewsCount", getInterviewsCount);

DashboardRouter.get("/formsCount", getFormsCount);

DashboardRouter.get("/studentActiveIntership", getStudentActiveInternship);

export default DashboardRouter;
