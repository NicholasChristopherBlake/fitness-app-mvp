import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

// Load environment variables
dotenv.config();

// Create an instance of Express
const app: Application = express();
const PORT = process.env.PORT || 4000;

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    credentials: true, // Allow cookies and HTTP authentication
  })
);

// Middlewares
app.use(express.json()); // parsing JSON
app.use(cookieParser());

// Routes
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);

// Start server
const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
