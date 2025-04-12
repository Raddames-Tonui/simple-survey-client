import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

const PrivateRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Show loader while checking auth state
  if (isLoading) {
    return <Loader />;
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Allow access to protected route
  return <Outlet />;
};

export default PrivateRoute;
