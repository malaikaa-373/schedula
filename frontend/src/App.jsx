import { Routes, Route } from "react-router-dom";   // ✅ BrowserRouter HATAYA
import { Toaster } from "react-hot-toast";
import useSocket from "./hooks/useSocket";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import PublicBooking from "./pages/PublicBooking";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import useBookingEvents from "./hooks/useBookingEvent.js";
import useNotifications from "./hooks/useNotifications.js"
import Checkout from "./pages/Checkout";
import Signup from "./pages/Signup";
import Staff from "./pages/Staff.jsx";
import Services from "./pages/Services";
import Bookings from "./pages/Bookings";
import EmbedCode from "./pages/EmbedCode.jsx";
import SuperAdmin from "./pages/SuperAdmin";
import Subscription from "./pages/Subscription";
import CalendarDesigner from "./pages/CalendarDesign";
import Tasks from "./pages/Task";

function App() {
  const socket = useSocket(import.meta.env.VITE_SOCKET_URL)
  useBookingEvents(socket);
  const { notifications, unreadCount, markAllRead } = useNotifications(socket);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1e293b",
            color: "#fff",
            borderRadius: "10px",
            padding: "16px",
          },
          success: {
            style: {
              background: "#065f46",
              color: "#d1fae5",
            },
            icon: "🎉",
          },
          error: {
            style: {
              background: "#7f1d1d",
              color: "#fecaca",
            },
            icon: "❌",
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/embed/:embedId" element={<PublicBooking />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard
          notifications={notifications} unreadCount={unreadCount} markAllRead={markAllRead}
        /></ProtectedRoute>
        } />
        <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
        <Route path="/subscription" element={<ProtectedRoute><Subscription /> </ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><Bookings /> </ProtectedRoute>} />
        <Route path="/embed-code" element={<ProtectedRoute><EmbedCode /> </ProtectedRoute>} />
        <Route path="/super-admin" element={<SuperAdmin />} />
        <Route path="/calendar-designer" element={<ProtectedRoute><CalendarDesigner /> </ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />

      </Routes>
    </>
  );
}

export default App;