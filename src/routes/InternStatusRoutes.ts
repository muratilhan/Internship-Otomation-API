import express from "express";
import {
  getInternStatusAC,
  getInternStatusById,
  getInternStatuses,
  updateInternStatus,
} from "../controllers/internStatusControllers/internStatus.controller";

const InternStatusRouter = express.Router();

InternStatusRouter.get("/get", getInternStatuses);

InternStatusRouter.get("/get/:internStatusId", getInternStatusById);

// Intership status
InternStatusRouter.put("/update/:internStatusId", updateInternStatus);

// AC
InternStatusRouter.get("/autocomplete", getInternStatusAC);

export default InternStatusRouter;
