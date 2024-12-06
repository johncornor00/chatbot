import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Users from "./pages/Users";
import WebScrape from "./pages/WebScrape";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import Chatapp from "./pages/Chatapp";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Define routes within the BrowserRouter */}
      <Routes>
        {/* Route for login */}
        <Route path="/" element={<Login />} />
        {/* Protected route for all other pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/add"
          element={
            <ProtectedRoute>
              <AddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/edit/:id"
          element={
            <ProtectedRoute>
              <EditUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/webscrape"
          element={
            <ProtectedRoute>
              <WebScrape />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatApp"
          element={
            <ProtectedRoute>
              <Chatapp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
