import { Router } from "express";
import { createPaymentIntent } from "../controllers/paymentController.js";
import { auth } from "../middleware/authenticate.js";

const router = Router();

router.post("/create-payment-intent", auth, createPaymentIntent);

export default router;