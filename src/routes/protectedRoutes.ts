import express from "express";

import userRouter from "./userRoute";
import dashboardRouter from "./dashboardRoute";
import profileRouter from "./profileRoutes";

const protectedRouter = express.Router();
protectedRouter.use("/dashboard", dashboardRouter);
protectedRouter.use("/profile", profileRouter);
protectedRouter.use("/user", userRouter);

export default protectedRouter;
