import {Router} from "express"
import {getBusiness , updateBusiness , createBusiness} from "../controllers/bussinessController.js"
import {auth } from "../middleware/authenticate.js"
import {authorize} from "../middleware/authorize.js"

const router = Router()

router.get("/me", auth, getBusiness)
router.put("/me", auth, authorize(["admin"]), updateBusiness)
router.post("/create", auth, createBusiness);

export{
    router
}