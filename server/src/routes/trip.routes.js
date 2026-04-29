import { Router } from "express";
import { searchTrips } from "../controllers/trip.controller.js";

const router = Router();

router.get("/search", searchTrips);

export default router;
