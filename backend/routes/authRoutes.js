import { Router } from "express";
import { 
    signup, 
    login, 
    logout, 
    refreshAccessToken 
} from "../controllers/authController.js";
import { createBusiness } from "../controllers/bussinessController.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);
router.post("/business-signup", createBusiness);

export default router;