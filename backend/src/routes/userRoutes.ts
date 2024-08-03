import express from "express";
import UserController from "../controllers/userController";

const router = express.Router();
// Create a new user
router.post("/users", UserController.createUser);

// Get all users
router.get("/users", UserController.getAllUsers);

// Get a specific user by ID
router.get("/users/:id", UserController.getUserById);

// Update a user's data
router.put("/users/:id", UserController.updateUser);

// Delete a user by ID
router.delete("/users/:id", UserController.deleteUser);

export default router;
