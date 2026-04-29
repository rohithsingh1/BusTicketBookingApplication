import { Router } from "express";
import authRoutes from "./auth.routes.js";
import tripRoutes from "./trip.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

router.use("/auth", authRoutes);
router.use("/trips", tripRoutes);

export default router;
