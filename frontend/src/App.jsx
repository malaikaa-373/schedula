import  Login  from "./pages/Login"
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from "./pages/Dashboard"
import { ProtectedRoute } from "./routes/ProtectedRoute"
import Calendar from "./pages/Calendar"
import PublicBooking from "./pages/PublicBooking.jsx";  
function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/Dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path='/calendar' element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      <Route path="/embed/:embedId" element={<PublicBooking />} />
      
    </Routes>
  )
}

export default App
