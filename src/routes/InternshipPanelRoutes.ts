import express from "express";

const InternshipPanelRouter = express.Router();

InternshipPanelRouter.post("/setConfig");

// Internship Panel
InternshipPanelRouter.post("/interviewStart");

InternshipPanelRouter.get("/get/:interviewId");

InternshipPanelRouter.get("/getConfidentalMailList");

InternshipPanelRouter.post("/sendConfidentalMail");

export default InternshipPanelRouter;
