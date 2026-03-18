import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { login as apiLogin } from "../api/auth";
import { setupAuthInterceptor } from "../api/api";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);

function resolveTypeFromClaims(claims) {
  if (!claims) return null;

  const kind = String(claims.kind ?? "").toLowerCase();
  const role = String(claims.role ?? "").toLowerCase();
  const type = String(claims.type ?? "").toLowerCase();

  if (kind === "table-device" || kind.includes("table")) return "table-device";
  if (claims.mesaId !== undefined && claims.mesaId !== null)
    return "table-device";
  if (type === "table-device" || type === "table_device") return "table-device";
  if (role === "table-device" || role === "table_device") return "table-device";

  if (kind.includes("client") || kind.includes("cliente")) return "client";
  if (claims.clienteId !== undefined && claims.clienteId !== null)
    return "client";
  if (type.includes("client") || type.includes("cliente")) return "client";
  if (role.includes("client") || role.includes("cliente")) return "client";

  if (role.includes("admin")) return "admin";
  if (type.includes("admin")) return "admin";
  if (role) return role;
  if (type) return type;

  return null;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("authToken") || "",
  );

  const claims = useMemo(() => {
    if (!token || token.split(".").length < 3) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }, [token]);

  const type = useMemo(() => resolveTypeFromClaims(claims), [claims]);

  useEffect(() => {
    if (token) localStorage.setItem("authToken", token);
    else localStorage.removeItem("authToken");
  }, [token]);

  const login = useCallback(async (identifier, password) => {
    const response = await apiLogin({ identifier, password });
    const resolvedToken = response?.token ?? response?.data?.token ?? "";
    const resolvedType = response?.type ?? response?.data?.type ?? null;

    if (!resolvedToken || typeof resolvedToken !== "string") {
      throw new Error("Login response without token");
    }

    setToken(resolvedToken);

    return {
      ...response,
      token: resolvedToken,
      type: resolvedType,
    };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("cart");
    setToken("");
  }, []);

  useEffect(() => {
    const cleanupInterceptor = setupAuthInterceptor(logout);
    return cleanupInterceptor;
  }, [logout]);

  const value = useMemo(
    () => ({
      token,
      type,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, type, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
