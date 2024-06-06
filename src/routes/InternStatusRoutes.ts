import express from "express";
import {
  downloadExcelList,
  getInternStatusAC,
  getInternStatusById,
  getInternStatuses,
  updateInternStatus,
} from "../controllers/internStatusControllers/internStatus.controller";
import { verifyRoles } from "../middlewares/permission.middleware";
import UserRoles from "../config/rolesList";

const InternStatusRouter = express.Router();

InternStatusRouter.get(
  "/get",
  verifyRoles(UserRoles.student),
  getInternStatuses
);

InternStatusRouter.get(
  "/get/:internStatusId",
  verifyRoles(UserRoles.student),
  getInternStatusById
);

// Intership status
InternStatusRouter.put(
  "/update/:internStatusId",
  verifyRoles(UserRoles.comission),
  updateInternStatus
);

// AC
InternStatusRouter.get("/autocomplete", getInternStatusAC);

InternStatusRouter.post(
  "/download/excel",
  verifyRoles(UserRoles.comission),
  downloadExcelList
);

export default InternStatusRouter;
