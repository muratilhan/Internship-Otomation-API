import express from "express";
import {
  getInternStatusById,
  getInternStatuses,
  updateInternStatus,
} from "../controllers/internStatusControllers/internStatus.controller";

const InternStatusRouter = express.Router();

InternStatusRouter.get("/get", getInternStatuses);

InternStatusRouter.get("/get/:internStatusId", getInternStatusById);

// only for students ??
InternStatusRouter.get("/get/myinternship");

// Intership status
InternStatusRouter.put("/update/:internStatusId", updateInternStatus);

// delete all connections with that internStatus --> InternForm , Interview , Survey , Confidental Report
InternStatusRouter.delete("/delete/:internStatusId");

export default InternStatusRouter;
