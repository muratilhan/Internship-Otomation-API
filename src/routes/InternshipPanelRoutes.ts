import express from "express";
import {
  addHoliday,
  deleteHoliday,
  getHolidays,
} from "../controllers/internshipPanelControllers/holiday.controller";
import {
  addEduYear,
  deleteEduYear,
  getEduYears,
  getEduYearsAC,
} from "../controllers/internshipPanelControllers/eduyear.controller";
import {
  addNewActiveFollowUp,
  getActiveFollowUp,
  getInterviewReady,
  startInterviews,
  updateActiveFollowUp,
} from "../controllers/internshipPanelControllers/internshipPanel.controller";
import { verifyRoles } from "../middlewares/permission.middleware";
import UserRoles from "../config/rolesList";

const InternshipPanelRouter = express.Router();

// Internship Panel
InternshipPanelRouter.post(
  "/startInterviews",
  verifyRoles(UserRoles.admin),
  startInterviews
);

InternshipPanelRouter.get(
  "/InterviewReady/get",
  verifyRoles(UserRoles.admin),
  getInterviewReady
);

// Holiday
InternshipPanelRouter.post(
  "/holiday/add",
  verifyRoles(UserRoles.admin),
  addHoliday
);

InternshipPanelRouter.delete(
  "/holiday/delete/:holidayId",
  verifyRoles(UserRoles.admin),
  deleteHoliday
);

InternshipPanelRouter.get(
  "/holiday/get",
  verifyRoles(UserRoles.student),
  getHolidays
);

// EduYear
InternshipPanelRouter.post(
  "/eduyear/add",
  verifyRoles(UserRoles.admin),
  addEduYear
);

InternshipPanelRouter.delete(
  "/eduyear/delete/:eduYearId",
  verifyRoles(UserRoles.admin),
  deleteEduYear
);

InternshipPanelRouter.get(
  "/eduyear/get",
  verifyRoles(UserRoles.admin),
  getEduYears
);

InternshipPanelRouter.get(
  "/eduyear/autocomplete",
  verifyRoles(UserRoles.student),
  getEduYearsAC
);

// Active Follow Up
InternshipPanelRouter.get(
  "/activeFollowUp/get",
  verifyRoles(UserRoles.admin),
  getActiveFollowUp
);

InternshipPanelRouter.post(
  "/activeFollowUp/add",
  verifyRoles(UserRoles.admin),
  addNewActiveFollowUp
);

InternshipPanelRouter.put(
  "/activeFollowUp/update/:activeFollowUpId",
  verifyRoles(UserRoles.admin),
  updateActiveFollowUp
);

export default InternshipPanelRouter;
