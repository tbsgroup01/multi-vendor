import React from "react";
import { Navigate } from "react-router-dom";

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const getRoleRedirectPath = (role) => {
  const normalized = (role || "").toLowerCase();
  if (normalized === "admin") return "/admin";
  if (normalized === "vendor") return "/vendor";
  return "/";
};

export const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  if (token && user) {
    return <Navigate to={getRoleRedirectPath(user.role)} replace />;
  }

  return children;
};
