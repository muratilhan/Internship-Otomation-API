import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { protect } from "./middlewares/auth.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { verifyRoles } from "./middlewares/permission.middleware";
import { ROLES } from "./config/rolesList";
import internFormRouter from "./routes/internFormRoute";
import credentials from "./middlewares/credentials.middleware";
import corsOptions from "./config/corsOptions";

import authRouter from "./routes/authRoutes";
import protectedRouter from "./routes/protectedRoutes";

const app = express();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // query string to js object
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/api", protect, protectedRouter);
// app.get("/api", protect, verifyRoles(ROLES.STUDENT), (req, res) => {
//   // this is a test req
//   res.json({ message: "that's it JWT token now active" });
// });

app.use(errorHandler);

export default app;
