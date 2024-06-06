import express from "express";

import InternFormRouter from "./InternFormRoutes";
import DashboardRouter from "./DashboardRoutes";
import ProfileRouter from "./profileRoutes";
import UserRouter from "./UserRoutes";
import SurveyRouter from "./SurveyRoutes";
import ConfidentalReportRouter from "./ConfidentalReportRoutes";
import InterviewRouter from "./InterviewRoutes";
import InternshipPanelRouter from "./InternshipPanelRoutes";
import InternStatusRouter from "./InternStatusRoutes";
import { verifyRoles } from "../middlewares/permission.middleware";
import UserRoles from "../config/rolesList";

const protectedRouter = express.Router();
protectedRouter.use(
  "/dashboard",
  verifyRoles(UserRoles.student),
  DashboardRouter
);
protectedRouter.use("/profile", verifyRoles(UserRoles.student), ProfileRouter);
protectedRouter.use("/user", UserRouter);

protectedRouter.use("/intern-status", InternStatusRouter);
protectedRouter.use("/intern-form", InternFormRouter);

protectedRouter.use("/survey", SurveyRouter);
protectedRouter.use("/confidental", ConfidentalReportRouter);
protectedRouter.use("/interview", InterviewRouter);

protectedRouter.use("/internship-panel", InternshipPanelRouter);

export default protectedRouter;
