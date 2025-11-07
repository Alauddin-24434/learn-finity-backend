import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authErrorHandler from "./middlewares/authEroroHandeller";
import { courseRoutes } from "./routes/course.routes";
import globalErrorHandler from "./middlewares/authEroroHandeller";

dotenv.config();


const app :Application= express();

app.use(express.json());
app.use(cors());
app.use(courseRoutes)
app.use(globalErrorHandler)


app.listen(process.env.PORT, () => {
    console.log(`Course server is running on port ${process.env.PORT}`)
})