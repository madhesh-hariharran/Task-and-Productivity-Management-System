import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./context/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import DashboardPage from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import AssignedTasks from "./pages/AssignedTasks";

// Separated so it can use useAuth (which needs AuthProvider above it in the tree)
function AppRoutes() {
  const { user, isLoading }  = useAuth()

  // while hydrating from token on refresh, render nothing to avoid flash
  if (isLoading) return null

  return (
    <>
      {user && <Navbar />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/assigned-tasks" element={<AssignedTasks/>} />
          {/* <Route path="/reminders" element={<Reminders />} /> */}
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App;