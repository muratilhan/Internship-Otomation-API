import * as dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
import app from "./server";
import config from "./config";

const prisma = new PrismaClient();

app.post(`/post`, async (req, res) => {
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
    },
  });
  res.json(user);
});

app.listen(3001, () => {
  console.log("Server start at : ");
});
