import { Router } from "express";
import { createService , getServices , deleteService , updateService } from "../controllers/serviceController.js";
import {auth} from "../middleware/authenticate.js"
import { authorize } from "../middleware/authorize.js";

const router = Router()

router.post("/", auth, authorize(["admin"]), createService)
router.get("/" , auth , getServices)
router.delete("/:id" , auth , authorize(["admin"]) , deleteService )
router.put("/:id" , auth , authorize(["admin"]) , updateService )

export{
    router
}


