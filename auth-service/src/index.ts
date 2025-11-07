import express, { Application } from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth.routes";
import authErrorHandler from "./middlewares/authEroroHandeller";



const app :Application= express();

app.use(express.json());
app.use(cors());
app.use(authRoutes)
app.use(authErrorHandler)
export default app;