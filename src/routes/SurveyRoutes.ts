import express from "express";
import {
  addNewSurvey,
  deleteSurvey,
  getAllSurveys,
  getCompanyInfoForSurvey,
  getSingleSurvey,
  updateSurvey,
} from "../controllers/surveyControllers/survey.controller";

const SurveyRouter = express.Router();

SurveyRouter.get("/get", getAllSurveys);

SurveyRouter.get("/get/:surveyId", getSingleSurvey);

SurveyRouter.put("/update/:surveyId", updateSurvey);

SurveyRouter.delete("/delete/:surveyId", deleteSurvey);

// Intern Status
SurveyRouter.post("/add", addNewSurvey);

SurveyRouter.get("/getCompanyInfo/:interviewId", getCompanyInfoForSurvey);

export default SurveyRouter;
