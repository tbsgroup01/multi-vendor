import React from "react";
import { Navigate } from "react-router-dom";

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.role === "string") {
      const lower = parsed.role.toLowerCase();
      if (lower.includes("admin")) {
        parsed.role = "admin";
      } else if (lower.includes("vendor") || lower.includes("seller")) {
        parsed.role = "vendor";
      }
    }
    return parsed;
  } catch (e) {
    return null;
  }
};

export const getRoleRedirectPath = (role) => {
  const normalized = (role || "").toLowerCase();
  if (normalized === "admin" || normalized.includes("admin")) return "/admin";
  if (normalized === "vendor" || normalized.includes("vendor") || normalized.includes("seller")) return "/vendor";
  return "/";
};

// Route wrapper for authenticated users by role
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user.role || "").toLowerCase();
    const isAllowed = allowedRoles.some((r) => {
      const allowed = r.toLowerCase();
      if (allowed === "admin") return userRole === "admin" || userRole.includes("admin");
      if (allowed === "vendor") return userRole === "vendor" || userRole.includes("vendor") || userRole.includes("seller");
      return allowed === userRole;
    });
    if (!isAllowed) {
      return <Navigate to={getRoleRedirectPath(user.role)} replace />;
    }
  }

  return children;
};

// Public Route (Redirects already logged in users to their respective dashboards)
export const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  if (token && user) {
    return <Navigate to={getRoleRedirectPath(user.role)} replace />;
  }

  return children;
};
