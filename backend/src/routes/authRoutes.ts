import express from "express";
import AuthController from "../controllers/AuthController";
import {
  handleValidationErrors,
  loginValidator,
  refreshValidator,
  registerValidator,
} from "../middlewares/authValidator";

const router = express.Router();
// Register a new user
router.post(
  "/register",
  registerValidator,
  handleValidationErrors,
  AuthController.register
);

// Log in
router.post(
  "/login",
  loginValidator,
  handleValidationErrors,
  AuthController.login
);

// Log out
router.post("/logout", AuthController.logout);

// Activate account using activation link
router.get("/activate/:link", AuthController.activate);

// Refresh access token
router.post("/refresh", refreshValidator, AuthController.refresh);

export default router;
