import express from "express";
import {
  downloadExcelList,
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

InternStatusRouter.post("/download/excel", downloadExcelList);

export default InternStatusRouter;
