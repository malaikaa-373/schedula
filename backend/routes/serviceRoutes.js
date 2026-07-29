import { Router } from "express";
import { createService , getServices , deleteService , updateService } from "../controllers/serviceController";
import {auth} from "../middleware/authenticate.js"
import { authorize } from "../middleware/authorize.js";

const route = Router()

router.post("/", auth, authorize(["admin"]), createService)
router.get("/" , auth , getServices)
router.delete("/:id" , auth , authorize(["admin"]) , deleteService )
router.put("/:id" , auth , authorize(["admin"]) , updateService )

export{
    router
}


