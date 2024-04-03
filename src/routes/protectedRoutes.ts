import express from "express";

import InternFormRouter from "./InternFormRoutes";
import DashboardRouter from "./DashboardRoutes";
import ProfileRouter from "./ProfileRoutes";
import UserRouter from "./UserRoutes";
import SurveyRouter from "./SurveyRoutes";
import ConfidentalReportRouter from "./ConfidentalReportRoutes";
import InterviewRouter from "./InterviewRoutes";
import InternshipPanelRouter from "./InternshipPanelRoutes";
import InternStatusRouter from "./InternStatusRoutes";

const protectedRouter = express.Router();
protectedRouter.use("/dashboard", DashboardRouter);
protectedRouter.use("/profile", ProfileRouter);
protectedRouter.use("/user", UserRouter);

protectedRouter.use("/intern-status", InternStatusRouter);
protectedRouter.use("/internform", InternFormRouter);

protectedRouter.use("/survey", SurveyRouter);
protectedRouter.use("/confidental", ConfidentalReportRouter);
protectedRouter.use("/interview", InterviewRouter);

protectedRouter.use("/internship-panel", InternshipPanelRouter);

export default protectedRouter;
