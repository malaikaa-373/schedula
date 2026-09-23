import { useEffect } from "react";
import toast from "react-hot-toast";
import useNotificationStore from "../store/notifications";

const useBookingEvents = (socket) => {
    // ✅ Notification store se addNotification lo
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        if (!socket) {
            console.log("No socket available for booking events");
            return;
        }

        console.log("Setting up booking event listener");

        // ✅ Booking Created
        const handleBookingCreated = (data) => {
            console.log("New booking received:", data);
            toast.success(`${data.clientName} booked a service!`);

            addNotification({
                _id: Date.now().toString(),
                message: `New booking from ${data.clientName}`,
                isRead: false,
                createdAt: new Date().toISOString(),
            });
        };

        // ✅ Booking Updated
        const handleBookingUpdated = (data) => {
            console.log("Booking updated:", data);
            toast(`${data.clientName}'s booking status changed to ${data.newStatus}!`);

            addNotification({
                _id: Date.now().toString() + "_updated",
                message: `${data.clientName}'s booking status changed to ${data.newStatus}`,
                isRead: false,
                createdAt: new Date().toISOString(),
            });
        };

        // ✅ Booking Cancelled
        const handleBookingCancelled = (data) => {
            console.log("Booking cancelled:", data);
            toast.error(`${data.clientName}'s booking was cancelled!`);

            addNotification({
                _id: Date.now().toString() + "_cancelled",
                message: `${data.clientName}'s booking was cancelled`,
                isRead: false,
                createdAt: new Date().toISOString(),
            });
        };

        // ✅ Listeners add karo
        socket.on("booking:created", handleBookingCreated);
        socket.on("booking:updated", handleBookingUpdated);
        socket.on("booking:cancelled", handleBookingCancelled);

        console.log("Booking event listener added");

        // ✅ Cleanup
        return () => {
            socket.off("booking:created", handleBookingCreated);
            socket.off("booking:updated", handleBookingUpdated);
            socket.off("booking:cancelled", handleBookingCancelled);
            console.log("Booking event listener removed");
        };
    }, [socket, addNotification]);
};

export default useBookingEvents;