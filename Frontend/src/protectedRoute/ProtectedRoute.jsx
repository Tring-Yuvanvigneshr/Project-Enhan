import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signIn" replace/>;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/signIn" replace/>;
  }

  return <Outlet />;

};

export default ProtectedRoute;
