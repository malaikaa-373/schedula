import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import AddTaskModal from "../components/AddTaskModal";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ✅ Tasks fetch karo
    const fetchTasks = async () => {
        try {
            const response = await api.get("/tasks");
            const tasksData =
                response.data.tasks ||
                response.data.Tasks ||
                Object.values(response.data).find((val) => Array.isArray(val)) ||
                [];
            setTasks(tasksData);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // ✅ Status update
    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await api.put(`/tasks/${taskId}/status`, { status: newStatus });
            toast.success("Task updated");
            fetchTasks();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update task");
        }
    };

    // ✅ Tasks ko 3 columns mein divide karo
    const todoTasks = tasks.filter((t) => t.status === "todo");
    const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
    const doneTasks = tasks.filter((t) => t.status === "done");

    // ✅ Priority color
    const getPriorityColor = (priority) => {
        if (priority === "high") return { bg: "#fee2e2", text: "#991b1b" };
        if (priority === "low") return { bg: "#dbeafe", text: "#1e40af" };
        return { bg: "#fef3c7", text: "#92400e" };
    };

    // ✅ Task Card
    const TaskCard = ({ task }) => (
        <div style={styles.taskCard}>
            <div style={styles.taskHeader}>
                <strong style={styles.taskTitle}>{task.title}</strong>
                <span
                    style={{
                        ...styles.priorityBadge,
                        backgroundColor: getPriorityColor(task.priority).bg,
                        color: getPriorityColor(task.priority).text,
                    }}
                >
                    {task.priority}
                </span>
            </div>

            {task.description && (
                <p style={styles.taskDesc}>{task.description}</p>
            )}

            <div style={styles.taskFooter}>
                <span style={styles.assignee}>
                    👤 {task.assigneeId?.name || "Unassigned"}
                </span>
                {task.dueDate && (
                    <span style={styles.dueDate}>
                        📅 {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                )}
            </div>

            {/* Status Buttons */}
            <div style={styles.statusButtons}>
                {task.status !== "todo" && (
                    <button
                        style={styles.moveBtn}
                        onClick={() =>
                            handleStatusChange(
                                task._id,
                                task.status === "done" ? "in-progress" : "todo"
                            )
                        }
                    >
                        ← Back
                    </button>
                )}
                {task.status !== "done" && (
                    <button
                        style={styles.moveBtn}
                        onClick={() =>
                            handleStatusChange(
                                task._id,
                                task.status === "todo" ? "in-progress" : "done"
                            )
                        }
                    >
                        Next →
                    </button>
                )}
            </div>
        </div>
    );

    // ✅ Column
    const Column = ({ title, tasks }) => (
        <div style={styles.column}>
            <div style={styles.columnHeader}>
                <h3 style={styles.columnTitle}>{title}</h3>
                <span style={styles.columnCount}>{tasks.length}</span>
            </div>
            <div style={styles.columnBody}>
                {tasks.length === 0 ? (
                    <p style={styles.emptyCol}>No tasks</p>
                ) : (
                    tasks.map((task) => <TaskCard key={task._id} task={task} />)
                )}
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>📋 Task Management</h1>
                    <p style={styles.subtitle}>Manage your team tasks here.</p>
                </div>
                <button style={styles.addBtn} onClick={() => setIsModalOpen(true)}>
                    + Add Task
                </button>
            </div>

            {/* Loading */}
            {loading ? (
                <div style={styles.loading}>Loading tasks...</div>
            ) : (
                <div style={styles.board}>
                    <Column title="📝 To Do" tasks={todoTasks} />
                    <Column title="⏳ In Progress" tasks={inProgressTasks} />
                    <Column title="✅ Done" tasks={doneTasks} />
                </div>
            )}

            {/* Add Task Modal */}
            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTaskAdded={fetchTasks}
            />
        </DashboardLayout>
    );
};

const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
    },
    title: {
        fontSize: "26px",
        fontWeight: "700",
        color: "#1e293b",
        margin: 0,
    },
    subtitle: {
        fontSize: "14px",
        color: "#64748b",
        margin: "4px 0 0 0",
    },
    addBtn: {
        padding: "10px 20px",
        backgroundColor: "#4F46E5",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
    },
    loading: {
        padding: "40px",
        textAlign: "center",
        color: "#64748b",
    },
    board: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
    },
    column: {
        backgroundColor: "#f8fafc",
        borderRadius: "12px",
        padding: "16px",
        minHeight: "400px",
        border: "1px solid #e2e8f0",
    },
    columnHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
        paddingBottom: "12px",
        borderBottom: "1px solid #e2e8f0",
    },
    columnTitle: {
        margin: 0,
        fontSize: "15px",
        fontWeight: "700",
        color: "#1e293b",
    },
    columnCount: {
        backgroundColor: "#e2e8f0",
        color: "#475569",
        padding: "2px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
    },
    columnBody: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    emptyCol: {
        textAlign: "center",
        color: "#94a3b8",
        fontSize: "13px",
        padding: "20px 0",
        fontStyle: "italic",
    },
    taskCard: {
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "12px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    },
    taskHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "8px",
        marginBottom: "6px",
    },
    taskTitle: {
        fontSize: "14px",
        color: "#1e293b",
        flex: 1,
    },
    priorityBadge: {
        padding: "2px 8px",
        borderRadius: "20px",
        fontSize: "10px",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    taskDesc: {
        fontSize: "12px",
        color: "#64748b",
        margin: "6px 0",
        lineHeight: 1.4,
    },
    taskFooter: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "11px",
        color: "#94a3b8",
        marginTop: "8px",
        paddingTop: "8px",
        borderTop: "1px solid #f1f5f9",
    },
    assignee: {},
    dueDate: {},
    statusButtons: {
        display: "flex",
        gap: "6px",
        marginTop: "10px",
    },
    moveBtn: {
        flex: 1,
        padding: "5px",
        backgroundColor: "#f1f5f9",
        color: "#475569",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: "600",
        cursor: "pointer",
    },
};

export default Tasks;