import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import { gatewayErrorHandler } from "./middlewares/getwayerrorhandler";
import { courseRoutes } from "./routes/course.route";
import { authRoutes } from "./routes/auth.routes";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use("/api/v1", authRoutes);
app.use("/api/v1", courseRoutes);
app.use(gatewayErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Get way server is running on port ${process.env.PORT}`);
});
