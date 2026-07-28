import {Router} from  "express"
import { createBusiness } from "../controllers/bussinessController.js"
import { login } from "../controllers/authController.js"

const router = Router()

router.post("/signup", createBusiness)

router.post("/login" , login)


export {
    router
}