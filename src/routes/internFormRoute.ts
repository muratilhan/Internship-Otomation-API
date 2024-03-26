import express from "express";
import { validateRequestSchema } from "../middlewares/validationHandler.middleware";
import { protect } from "../middlewares/auth.middleware";
import {
  addNewForm,
  getAllForms,
} from "../controllers/InternFormControllers/internForm.controller";

const internFormRouter = express.Router();

internFormRouter.post("/addNewForm", protect, addNewForm);

internFormRouter.get("/getForms", protect, getAllForms);

export default internFormRouter;
