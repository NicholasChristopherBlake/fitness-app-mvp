import express from "express";
import UserController from "../controllers/UserController";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

// router.use(authenticate); // if we want to apply authenticate to all routes in this file

// Get all users
router.get(
  "/users",
  authenticate,
  authorize("admin"),
  UserController.getAllUsers
);

// Get a specific user by ID
router.get("/users/:id", UserController.getUserById);

// Update a user's data
router.put("/users/:id", UserController.updateUser);

// Delete a user by ID
router.delete("/users/:id", UserController.deleteUser);

export default router;
