import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  

const PrivateRoute = () => {
  const { user } = useAuth();  

  // If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  // If the user is logged in, render the child routes (protected route)
  return <Outlet />;
};

export default PrivateRoute;
