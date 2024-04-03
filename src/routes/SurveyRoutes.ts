import express from "express";

const SurveyRouter = express.Router();

SurveyRouter.get("/get");

SurveyRouter.get("/get/:surveyId");

SurveyRouter.put("/update/:surveyId");

SurveyRouter.delete("/delete/:surveyId");

// Intern Status
SurveyRouter.post("/add");

export default SurveyRouter;
