import express from "express";
import { getHolidays } from "../controllers/internshipPanelControllers/holiday.controller";

const InternshipPanelRouter = express.Router();

InternshipPanelRouter.post("/setConfig");

// Internship Panel
InternshipPanelRouter.post("/interviewStart");

InternshipPanelRouter.get("/get/:interviewId");

InternshipPanelRouter.get("/getConfidentalMailList");

InternshipPanelRouter.post("/sendConfidentalMail");

InternshipPanelRouter.post("/addHolidays");

InternshipPanelRouter.delete("/deleteHolidays");

InternshipPanelRouter.get("/getHolidays", getHolidays);

export default InternshipPanelRouter;
