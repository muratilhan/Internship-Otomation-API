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
  getConfidentalMailList,
  getInterviewReady,
  startInterviews,
  updateActiveFollowUp,
} from "../controllers/internshipPanelControllers/internshipPanel.controller";

const InternshipPanelRouter = express.Router();

// Internship Panel
InternshipPanelRouter.post("/startInterviews", startInterviews);

InternshipPanelRouter.get("/ConfidentalMailList/get", getConfidentalMailList);

InternshipPanelRouter.get("/InterviewReady/get", getInterviewReady);

// Holiday
InternshipPanelRouter.post("/holiday/add", addHoliday);

InternshipPanelRouter.delete("/holiday/delete/:holidayId", deleteHoliday);

InternshipPanelRouter.get("/holiday/get", getHolidays);

// EduYear
InternshipPanelRouter.post("/eduyear/add", addEduYear);

InternshipPanelRouter.delete("/eduyear/delete/:eduYearId", deleteEduYear);

InternshipPanelRouter.get("/eduyear/get", getEduYears);

InternshipPanelRouter.get("/eduyear/autocomplete", getEduYearsAC);

// Active Follow Up
InternshipPanelRouter.get("/activeFollowUp/get", getActiveFollowUp);

InternshipPanelRouter.post("/activeFollowUp/add", addNewActiveFollowUp);

InternshipPanelRouter.put(
  "/activeFollowUp/update/:activeFollowUpId",
  updateActiveFollowUp
);

export default InternshipPanelRouter;
