import express from "express";
import { validateRequestSchema } from "../middlewares/validationHandler.middleware";
import { protect } from "../middlewares/auth.middleware";

const internFormRouter = express.Router();

internFormRouter.post("/addNewForm");

export default internFormRouter;
