import express from "express";
import { validateRequestSchema } from "../middlewares/validationHandler.middleware";
import {
  changePassword,
  sendPasswordRefresh,
} from "../controllers/authControllers/passwordRefresh.controller";
import { passwordResetSchema } from "../validations/passwordReset.schema";
import { changePasswordSchema } from "../validations/changePassword.schema";
import { getDashboardProfile } from "../controllers/dashboardControllers/dahboard.controller";

const dashboardRouter = express.Router();

dashboardRouter.get("/profile", getDashboardProfile);

export default dashboardRouter;
