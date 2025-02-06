import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./views/Dashboard";
import Management from "./views/Management";
import AdminPanel from "./views/AdminPanel";
import Register from "./views/Register";
import Login from "./views/Login";
import History from "./views/History";
import ProblemReportForm from "./views/ProblemReportForm";
import ParkingReports from "./views/ParkingReports";
import { isExpired } from "react-jwt";

const App: React.FC = () => {
  const token = localStorage.getItem("token") ?? "";
  const isLoggedIn = !isExpired(token);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/management" element={<Management />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={isLoggedIn ? <AdminPanel /> : <Login />}
        />
        <Route
          path="/parkingreports"
          element={isLoggedIn ? <ParkingReports /> : <Login />}
        />
        <Route path="/current" element={isLoggedIn ? <History /> : <Login />} />
        <Route
          path="/report"
          element={isLoggedIn ? <ProblemReportForm /> : <Login />}
        />
      </Routes>
    </Router>
  );
};

export default App;
