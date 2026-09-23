import { Router } from "express";
import express from "express";
import { handleWebhook } from "../controllers/webhookController.js";

const router = Router();

router.post("/", express.raw({ type: "application/json" }), handleWebhook);

export default router;