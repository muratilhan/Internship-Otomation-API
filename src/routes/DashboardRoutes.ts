import express from "express";

import { getDashboardProfile } from "../controllers/dashboardControllers/dahboard.controller";

const DashboardRouter = express.Router();

DashboardRouter.get("/profile", getDashboardProfile);

export default DashboardRouter;
