import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { isLoggedIn } from "./utils/token";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import DashboardPage from "./pages/Dashboard";
import Tasks from "./pages/Tasks";

function App() {
  return (
    <Router>

      {isLoggedIn() && <Navbar />}

      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<Tasks />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>

    </Router>
  );
}

export default App;