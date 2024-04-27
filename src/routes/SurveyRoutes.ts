import express from "express";
import {
  addNewSurvey,
  deleteSurvey,
  deleteSurveys,
  getAllSurveys,
  getSingleSurvey,
  updateSurvey,
} from "../controllers/surveyControllers/survey.controller";

const SurveyRouter = express.Router();

SurveyRouter.get("/get", getAllSurveys);

SurveyRouter.get("/get/:surveyId", getSingleSurvey);

SurveyRouter.put("/update/:surveyId", updateSurvey);

SurveyRouter.delete("/delete/:surveyId", deleteSurvey);
SurveyRouter.delete("/delete/", deleteSurveys);

// Intern Status
SurveyRouter.post("/add", addNewSurvey);

export default SurveyRouter;
