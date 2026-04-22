import { Router } from "express";
import {
  getCurrentUser,
  handleGoogleCallback,
  loginWithCredentials,
  registerWithCredentials,
  logout,
  startGoogleAuth,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", registerWithCredentials);
router.post("/login", loginWithCredentials);
router.get("/google", startGoogleAuth);
router.get("/google/callback", handleGoogleCallback);
router.get("/me", requireAuth, getCurrentUser);
router.post("/logout", logout);

export default router;
