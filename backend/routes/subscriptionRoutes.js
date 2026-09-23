import { Router } from "express";
import { createCheckoutSession , createPortalSession} from "../controllers/subscriptionController.js";
import { auth } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.post("/create-checkout-session", auth, authorize(["admin" , "superadmin"]), createCheckoutSession); 
router.post("/create-portal-session", auth, createPortalSession);

export default router;