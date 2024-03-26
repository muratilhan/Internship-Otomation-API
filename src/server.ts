import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute";
import { protect } from "./middlewares/auth.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { verifyRoles } from "./middlewares/permission.middleware";
import { ROLES } from "./config/rolesList";
import internFormRouter from "./routes/internFormRoute";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // query string to js object
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/internform", internFormRouter);
app.get("/api", protect, verifyRoles(ROLES.STUDENT), (req, res) => {
  // this is a test req
  res.json({ message: "that's it JWT token now active" });
});

app.use(errorHandler);

export default app;
