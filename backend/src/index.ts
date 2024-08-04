import express, { Application } from "express";
// import pool from "./config/db"; // Import the connection pool
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";

// Load environment variables
dotenv.config();

// Create an instance of Express
const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware for parsing JSON
app.use(express.json());

// Use the user routes
app.use("/api", userRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to the Fitness Diary API!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
