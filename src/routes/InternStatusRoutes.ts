import express from "express";
import {
  getInternStatusById,
  getInternStatuses,
  updateInternStatus,
  updateOnlyStatus,
} from "../controllers/internStatusControllers/internStatus.controller";

const InternStatusRouter = express.Router();

InternStatusRouter.get("/get", getInternStatuses);

InternStatusRouter.get("/get/:internStatusId", getInternStatusById);

// Intership status
InternStatusRouter.put("/update/:internStatusId", updateInternStatus);

// update only Status
InternStatusRouter.put("/update/status/:interStatusId", updateOnlyStatus);

// delete all connections with that internStatus --> InternForm , Interview , Survey , Confidental Report
InternStatusRouter.delete("/delete/:internStatusId");

export default InternStatusRouter;
