import express from "express";
import { validateRequestSchema } from "../middlewares/validationHandler.middleware";
import { protect } from "../middlewares/auth.middleware";

const InternFormRouter = express.Router();

InternFormRouter.get("/get");
InternFormRouter.post("/add");
InternFormRouter.get("/get/:internFormId");
InternFormRouter.put("/update/:internFormId");
InternFormRouter.delete("/delete/:internFormId");

// Student Info
InternFormRouter.post("/student-info/add");
InternFormRouter.put("/student-info/:internFormId");
// Company Info
InternFormRouter.post("/company-info/add");
InternFormRouter.put("/company-info/:internFormId");

export default InternFormRouter;
