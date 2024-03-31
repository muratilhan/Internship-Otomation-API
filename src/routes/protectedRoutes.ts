import express from "express";

import userRouter from "./userRoute";
import dashboardRouter from "./dashboardRoute";
import profileRouter from "./profileRoutes";
import internFormRouter from "./internFormRoute";
import companyInfoRouter from "./companyInfo";
import studentInfoRouter from "./studentInfo";

const protectedRouter = express.Router();
protectedRouter.use("/dashboard", dashboardRouter);
protectedRouter.use("/profile", profileRouter);
protectedRouter.use("/user", userRouter);
protectedRouter.use("/internform", internFormRouter);
protectedRouter.use("/companyinfo", companyInfoRouter);
protectedRouter.use("/studentinfo", studentInfoRouter);

export default protectedRouter;
