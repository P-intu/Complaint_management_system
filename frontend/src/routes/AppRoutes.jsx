import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Layouts
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import LandingLayout from "../layouts/LandingLayout";

// Pages
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import CreateComplaint from "../pages/CreateComplaint";
import EditComplaint from "../pages/EditComplaint";
import ComplaintDetail from "../pages/ComplaintDetail";

// Reusable loader
import Skeleton from "../components/Skeleton";

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Skeleton.OverviewSkeleton />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isStaff, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Skeleton.OverviewSkeleton />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isStaff) {
    return <Navigate to="/complaints" replace />;
  }

  return children;
};

// Check if user is logged in, redirect them away from Auth Pages (like login/register) to dashboard
const UnauthenticatedRoute = ({ children }) => {
  const { isAuthenticated, isStaff, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={isStaff ? "/admin" : "/complaints"} replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route
        path="/"
        element={
          <LandingLayout>
            <Landing />
          </LandingLayout>
        }
      />

      {/* Authentication (Split-Screen) */}
      <Route
        path="/login"
        element={
          <UnauthenticatedRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <UnauthenticatedRoute>
            <AuthLayout>
              <Register />
            </AuthLayout>
          </UnauthenticatedRoute>
        }
      />

      {/* User Dashboard Protected */}
      <Route
        path="/complaints"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <UserDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CreateComplaint />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/complaints/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ComplaintDetail />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <EditComplaint />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard Protected */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </AdminRoute>
        }
      />

      {/* Fallback Catch-All Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
