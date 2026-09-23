import { Router } from "express";
import {
    getAllTenants,
    getPlatformAnalytics,
    suspendBusiness,
    activateBusiness
} from "../controllers/adminController.js";
import { auth } from "../middleware/authenticate.js";
import { superAdmin } from "../middleware/superAdmin.js";

const router = Router();

// ✅ Saari routes pe authenticate + superAdmin middleware
router.use(auth);
router.use(superAdmin);

// ✅ Routes
router.get("/tenants", getAllTenants);
router.get("/analytics", getPlatformAnalytics);
router.put("/tenants/:id/suspend", suspendBusiness);
router.put("/tenants/:id/activate", activateBusiness);

export default router;