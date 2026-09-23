import { create } from "zustand";

const useNotificationStore = create((set) => ({
    notifications: [],

    setNotifications: (notifications) => set({ notifications }),

    addNotification: (notification) =>
        set((state) => ({
            notifications: [notification, ...state.notifications],
        })),

    markAsRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n._id === id ? { ...n, isRead: true } : n
            ),
        })),
}));

export default useNotificationStore;