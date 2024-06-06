import express from "express";
import {
  addNewSurvey,
  deleteSurvey,
  getAllSurveys,
  getCompanyInfoForSurvey,
  getSingleSurvey,
  unlockSurveySeal,
  updateSurvey,
} from "../controllers/surveyControllers/survey.controller";
import { verifyRoles } from "../middlewares/permission.middleware";
import UserRoles from "../config/rolesList";

const SurveyRouter = express.Router();

SurveyRouter.get("/get", verifyRoles(UserRoles.student), getAllSurveys);

SurveyRouter.get(
  "/get/:surveyId",
  verifyRoles(UserRoles.student),
  getSingleSurvey
);

SurveyRouter.put(
  "/update/:surveyId",
  verifyRoles(UserRoles.student),
  updateSurvey
);

SurveyRouter.delete(
  "/delete/:surveyId",
  verifyRoles(UserRoles.comission),
  deleteSurvey
);

// Intern Status
SurveyRouter.post("/add", verifyRoles(UserRoles.student), addNewSurvey);

SurveyRouter.get("/getCompanyInfo/:interviewId", getCompanyInfoForSurvey);

SurveyRouter.put(
  "/unlock/:surveyId",
  verifyRoles(UserRoles.comission),
  unlockSurveySeal
);

export default SurveyRouter;
