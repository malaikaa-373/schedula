import { Router } from "express";
import { auth } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import {
    createTask,
    getTasks,
    updateTaskStatus,
    deleteTask
} from "../controllers/taskController.js";

const router = Router();

// ✅ Create Task (admin + superadmin)
router.post("/", auth, authorize(["admin", "superadmin"]), createTask);

// ✅ Get All Tasks (sabhi logged-in users)
router.get("/", auth, getTasks);

// ✅ Update Task Status
router.put("/:id/status", auth, updateTaskStatus);

// ✅ Delete Task (admin + superadmin)
router.delete("/:id", auth, authorize(["admin", "superadmin"]), deleteTask);

export { router };