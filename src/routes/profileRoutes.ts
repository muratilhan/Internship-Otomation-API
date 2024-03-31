import express from "express";
import { validateRequestSchema } from "../middlewares/validationHandler.middleware";

import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profileControllers/profile.controller";
import { updateProfileSchema } from "../validations/profile/updateProfile.schema";

const profileRouter = express.Router();

profileRouter.get("/myprofile", getMyProfile);
profileRouter.put(
  "/update",
  updateProfileSchema,
  validateRequestSchema,
  updateMyProfile
);

export default profileRouter;
