import { Router } from "express";
import { addStaff, getStaff , updateStaff , deactivatStaff } from "../controllers/staffController.js";
import {auth} from "../middleware/authenticate.js"
import { authorize } from "../middleware/authorize.js";

const router = Router()

router.post("/", auth, authorize(["admin"]), addStaff)
router.put("/:id", auth, authorize(["admin"]), updateStaff)
router.get("/", auth, getStaff)
router.put("/:id/deactivate" , auth , authorize(["admin"]) , deactivatStaff)

export{
    router
}