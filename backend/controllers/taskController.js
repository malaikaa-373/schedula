import { io } from "../server.js";
import { Task } from "../models/task.models.js";
import { Notification } from "../models/notification.models.js";

// ✅ 1. Create Task
const createTask = async (req, res) => {
    try {
        const { title, description, assigneeId, linkedBookingId, priority, dueDate } = req.body;

        if (!title || !assigneeId) {
            return res.status(400).json({
                success: false,
                message: "Title and assignee are required"
            });
        }

        const newTask = await Task.create({
            businessId: req.user.businessId,
            title,
            description,
            assigneeId,
            linkedBookingId,
            priority,
            dueDate
        });

        // ✅ Notification save
        await Notification.create({
            businessId: req.user.businessId,
            userId: assigneeId,
            type: "task_assigned",
            message: `You have been assigned a new task: ${title}`,
            isRead: false
        });

        // ✅ Socket events
        io.to(`user:${assigneeId}`).emit("task:assigned", {
            taskId: newTask._id,
            title: newTask.title,
            message: `You have been assigned a new task: ${title}`
        });

        io.to(`user:${assigneeId}`).emit("notification:new", {
            type: "task_assigned",
            message: `You have been assigned a new task: ${title}`
        });

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            task: newTask
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

// ✅ 2. Get All Tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ businessId: req.user.businessId })
            .populate("assigneeId", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            tasks: tasks
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

// ✅ 3. Update Task Status
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !["todo", "in-progress", "done"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Valid status is required"
            });
        }

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, businessId: req.user.businessId },
            { status },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task status updated",
            task
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

// ✅ 4. Delete Task (YEH ADD KARO)
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            businessId: req.user.businessId
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

export {
    createTask,
    getTasks,
    updateTaskStatus,
    deleteTask
};