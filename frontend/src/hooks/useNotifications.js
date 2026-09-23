import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useNotifications = (socket) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!socket) {
            console.log("No socket available for notifications");
            return;
        }

        const handleNewNotification = (data) => {
            console.log("New notification received:", data);
            setNotifications((prev) => [data, ...prev]);
            setUnreadCount((prev) => prev + 1);
            toast(data.message);
        };

        socket.on("notification:new", handleNewNotification);
        console.log("Notification listener added");

        return () => {
            socket.off("notification:new", handleNewNotification);
            console.log("Notification listener removed");
        };
    }, [socket]);

    const markAllRead = () => {
        setUnreadCount(0);
    };

    return { notifications, unreadCount, markAllRead };
};

export default useNotifications;