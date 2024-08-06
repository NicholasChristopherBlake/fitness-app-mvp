import express from "express";
import AuthController from "../controllers/authController";

const router = express.Router();
// Register a new user
router.post("/register", AuthController.register);

// Log in
router.post("/login", AuthController.login);

// Log out
router.get("/logout", AuthController.logout);

// Activate account using activation link
router.get("/activate/:link", AuthController.activate);

// Refresh access token
router.get("/refresh", AuthController.refresh);

export default router;
