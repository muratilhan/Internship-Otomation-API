import express from "express";
import { validateRequestSchema } from "../middlewares/validationHandler.middleware";
import { protect } from "../middlewares/auth.middleware";
import {
  addNewCompany,
  deleteSingleCompany,
  getAllCompanies,
  getSingleCompany,
  updateSingleCompany,
} from "../controllers/InternFormControllers/companyInfo.controller";

const companyInfoRouter = express.Router();

companyInfoRouter.post("/addNewCompany", protect, addNewCompany);
companyInfoRouter.get("/getSingleCompany", protect, getSingleCompany);
companyInfoRouter.get("/getAllCompanies", protect, getAllCompanies);
companyInfoRouter.delete("/deleteSingleCompany", protect, deleteSingleCompany);
companyInfoRouter.post("/updateSingleCompany", protect, updateSingleCompany);

export default companyInfoRouter;
