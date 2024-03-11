import express from "express";
import morgan from "morgan";
import cors from "cors";

import userRouter from "./routes/userRoute";
import { protect } from "./middlewares/authMiddleware";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // query string to js object

app.use("/user", userRouter);
app.get("/api", protect, (req, res) => {
  // this is a test req
  res.json({ message: "that's it JWT token now active" });
});

export default app;
