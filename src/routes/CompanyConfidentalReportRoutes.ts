import express from "express";
import {
  createCompanyConfidentalReport,
  getCompanyConfidentalReport,
} from "../controllers/confidentalReportControllers/companyConfidental.controller";

const companyConfidentalReportRouter = express.Router();

companyConfidentalReportRouter.get(
  "/confidential/get/:confidentalReportToken",
  getCompanyConfidentalReport
);

companyConfidentalReportRouter.put(
  "/confidential/create",
  createCompanyConfidentalReport
);

export default companyConfidentalReportRouter;
