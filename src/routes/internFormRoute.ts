import express from "express";
import { validateRequestSchema } from "../middlewares/validationHandler.middleware";
import { protect } from "../middlewares/auth.middleware";
import {
  addNewForm,
  deleteAllForms,
  deleteSingleForm,
  getAllForms,
  getSingleForm,
} from "../controllers/InternFormControllers/internForm.controller";

const internFormRouter = express.Router();

internFormRouter.post("/addNewForm", protect, addNewForm);
internFormRouter.get("/getForms", protect, getAllForms);
internFormRouter.get("/getSingleForm", protect, getSingleForm);
internFormRouter.delete("/deleteSingleForm", protect, deleteSingleForm);
internFormRouter.delete("/deleteAllForms", protect, deleteAllForms);

export default internFormRouter;
