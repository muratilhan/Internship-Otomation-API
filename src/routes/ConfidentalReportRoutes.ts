import express from "express";

const ConfidentalReportRouter = express.Router();

ConfidentalReportRouter.get("/get");

ConfidentalReportRouter.get("/get/:confidentalId");

ConfidentalReportRouter.post("/manueladd");

ConfidentalReportRouter.delete("/delete/:confidentalId");

export default ConfidentalReportRouter;
