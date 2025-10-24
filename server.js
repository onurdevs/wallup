import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.route.ts";
import { connectDB } from "./src/config/db.js";

dotenv.config();
connectDB();

const app = express();

const PORT = 5001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${PORT}`);
})