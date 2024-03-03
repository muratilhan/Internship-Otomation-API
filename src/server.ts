import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // query string to js object

app.get("/", (req, res) => {
  res.json({ message: "this is first req" });
});

export default app;
