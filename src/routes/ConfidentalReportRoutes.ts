import express from "express";
import {
  addNewConfidentalReport,
  deleteConfidentalReport,
  getAllConfidentalReports,
  getSingleConfidentalReport,
  updateConfidentalReport,
} from "../controllers/confidentalReportControllers/confidentalReport.controller";
import { verifyRoles } from "../middlewares/permission.middleware";
import UserRoles from "../config/rolesList";

const ConfidentalReportRouter = express.Router();

ConfidentalReportRouter.get(
  "/get",
  verifyRoles(UserRoles.comission),
  getAllConfidentalReports
);

ConfidentalReportRouter.get(
  "/get/:confidentalReportId",
  verifyRoles(UserRoles.comission),
  getSingleConfidentalReport
);

ConfidentalReportRouter.post(
  "/add",
  verifyRoles(UserRoles.comission),
  addNewConfidentalReport
);

ConfidentalReportRouter.delete(
  "/delete/:confidentalReportId",
  verifyRoles(UserRoles.comission),
  deleteConfidentalReport
);
ConfidentalReportRouter.put(
  "/update/:confidentalReportId",
  verifyRoles(UserRoles.comission),
  updateConfidentalReport
);
export default ConfidentalReportRouter;
