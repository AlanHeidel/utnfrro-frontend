import { useEffect, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth.jsx";
import { jwtDecode } from "jwt-decode";

function getTokenExpMs(token) {
  if (!token || token.split(".").length < 3) return null;
  try {
    const claims = jwtDecode(token);
    const rawExp = Number(claims?.exp);
    if (!Number.isFinite(rawExp)) return null;
    return rawExp > 1_000_000_000_000 ? rawExp : rawExp * 1000;
  } catch {
    return null;
  }
}

export function ProtectedRoute({ children, allowed = [] }) {
  const { token, isAuthenticated, type, logout } = useAuth();
  const location = useLocation();
  const isAdminRoute = allowed.includes("admin");

  const isAdminTokenExpired = useMemo(() => {
    if (!isAdminRoute || !token) return false;
    const expMs = getTokenExpMs(token);
    if (!expMs) return false;
    return Date.now() >= expMs;
  }, [isAdminRoute, token]);

  useEffect(() => {
    if (isAdminTokenExpired) logout();
  }, [isAdminTokenExpired, logout]);

  const loginRouteByType = {
    admin: "/admin/login",
    "table-device": "/menu/login",
    client: "/reservas/login",
    cliente: "/reservas/login",
  };

  if (!isAuthenticated) {
    const expectedType = allowed[0];
    const loginPath = loginRouteByType[expectedType] ?? "/";
    return <Navigate to={loginPath} replace state={{ from: location.pathname }} />;
  }

  if (isAdminTokenExpired) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const isAllowed = allowed.length === 0 || allowed.includes(type);
  if (!isAllowed) {
    const homeByType = {
      admin: "/admin",
      "table-device": "/menu",
      client: "/reservas",
      cliente: "/reservas",
    };
    return <Navigate to={homeByType[type] ?? "/"} replace />;
  }

  return children;
}
