import express from "express";
import {
  addNewConfidentalReport,
  deleteConfidentalReport,
  getAllConfidentalReports,
  getSingleConfidentalReport,
  updateConfidentalReport,
} from "../controllers/internFormControllers/confidentalReport.controller";

const ConfidentalReportRouter = express.Router();

ConfidentalReportRouter.get("/get", getAllConfidentalReports);

ConfidentalReportRouter.get(
  "/get/:confidentalReportId",
  getSingleConfidentalReport
);

ConfidentalReportRouter.post("/add", addNewConfidentalReport);

ConfidentalReportRouter.delete(
  "/delete/:confidentalReportId",
  deleteConfidentalReport
);
ConfidentalReportRouter.put(
  "/update/:confidentalReportId",
  updateConfidentalReport
);
export default ConfidentalReportRouter;
