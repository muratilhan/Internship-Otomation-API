import express from "express";
import { validateRequestSchema } from "../middlewares/validationHandler.middleware";
import { protect } from "../middlewares/auth.middleware";
import {
  addNewStudentInfo,
  deleteAllStudentInfos,
  deleteSingleStudentInfo,
  getAllStudentInfos,
  getSingleStudentInfo,
} from "../controllers/InternFormControllers/studentInfo.controller";

const studentInfoRouter = express.Router();

studentInfoRouter.post("/addNewStudentInfo", protect, addNewStudentInfo);
studentInfoRouter.get("/getStudentInfos", protect, getAllStudentInfos);
studentInfoRouter.get("/getSingleStudentInfo", protect, getSingleStudentInfo);
studentInfoRouter.delete(
  "/deleteSingleStudentInfo",
  protect,
  deleteSingleStudentInfo
);
studentInfoRouter.delete(
  "/deleteAllStudentInfos",
  protect,
  deleteAllStudentInfos
);

export default studentInfoRouter;
