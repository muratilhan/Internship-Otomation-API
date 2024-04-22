import express from "express";
import { validateRequestSchema } from "../middlewares/validationHandler.middleware";

import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profileControllers/profile.controller";
import { updateProfileSchema } from "../validations/profile/updateProfile.schema";

const ProfileRouter = express.Router();

ProfileRouter.get("/myprofile", getMyProfile);
ProfileRouter.put(
  "/update",
  updateProfileSchema,
  validateRequestSchema,
  updateMyProfile
);

export default ProfileRouter;
