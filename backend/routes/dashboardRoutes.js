import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { auth } from "../middleware/authenticate.js";

const router = Router();

// ✅ Dashboard stats — authenticated users
router.get("/stats", auth, getDashboardStats);

export default router;