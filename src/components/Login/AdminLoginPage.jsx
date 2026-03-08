import { useState } from "react";
import { useAuth } from "../../context/auth.jsx";
import { Eye, EyeOff, Monitor } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import "./LoginCard.css";

function resolveUserTypeFromToken(token) {
  if (!token || token.split(".").length < 3) return "";
  try {
    const claims = jwtDecode(token);
    const kind = String(claims?.kind ?? "").toLowerCase();
    const role = String(claims?.role ?? "").toLowerCase();
    const type = String(claims?.type ?? "").toLowerCase();

    if (kind === "table-device" || kind.includes("table")) return "table-device";
    if (claims?.mesaId !== undefined && claims?.mesaId !== null) return "table-device";
    if (role === "table-device" || role === "table_device") return "table-device";
    if (type === "table-device" || type === "table_device") return "table-device";

    if (role.includes("admin")) return "admin";
    if (type.includes("admin")) return "admin";
    if (role) return role;
    if (type) return type;
  } catch {
    return "";
  }
  return "";
}

export function AdminLoginPage() {
  const { login, logout } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(identifier, password);
      const resolvedToken = result?.token || localStorage.getItem("authToken");
      const userType = resolveUserTypeFromToken(resolvedToken);
      if (userType !== "admin") {
        logout();
        setError("Acceso denegado. Solo administradores.");
        return;
      }
      window.location.replace("/admin");
    } catch {
      setError("Credenciales inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-page__left">
        <div className="login-page__icon-shell" aria-hidden="true">
          <Monitor />
        </div>
      </section>

      <section className="login-page__right">
        <div className="login-card">
          <form onSubmit={handleSubmit} className="form-content">
            <h1 className="title">Panel Administrador</h1>
            {error && <p className="error-text">{error}</p>}
            <div className="input-box-container">
              <div className="input-box">
                <input
                  placeholder="Usuario"
                  required
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
              <div className="input-box">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="login-footer-container">
              <button className="button-entrar" type="submit" disabled={loading}>
                {loading ? "Ingresando..." : "Entrar"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
