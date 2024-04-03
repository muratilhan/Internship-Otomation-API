import express from "express";

const InternStatusRouter = express.Router();

InternStatusRouter.get("/get");

InternStatusRouter.get("/get/:internStatusId");

InternStatusRouter.get("/get/myinternship");

// Intership status
InternStatusRouter.put("/update/:internStatusId");

export default InternStatusRouter;
