import express from "express";
import { getHolidays } from "../controllers/internshipPanelControllers/holiday.controller";
import {
  addEduYear,
  deleteEduYear,
  getEduYears,
  getEduYearsAC,
} from "../controllers/internshipPanelControllers/eduyear.controller";

const InternshipPanelRouter = express.Router();

InternshipPanelRouter.post("/setConfig");

// Internship Panel
InternshipPanelRouter.post("/interviewStart");

InternshipPanelRouter.get("/get/:interviewId");

InternshipPanelRouter.get("/getConfidentalMailList");

InternshipPanelRouter.post("/sendConfidentalMail");

// Holiday
InternshipPanelRouter.post("/holiday/add");

InternshipPanelRouter.delete("/holiday/delete/:holidayId");

InternshipPanelRouter.get("/holiday/get", getHolidays);

// EduYear
InternshipPanelRouter.post("/eduyear/add", addEduYear);

InternshipPanelRouter.delete("/eduyear/delete/:eduYearId", deleteEduYear);

InternshipPanelRouter.get("/eduyear/get", getEduYears);

InternshipPanelRouter.get("/eduyear/autocomplete", getEduYearsAC);

export default InternshipPanelRouter;
