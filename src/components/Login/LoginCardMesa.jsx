import { useState } from "react";
import { useAuth } from "../../context/auth.jsx";
import { CircleAlert, Eye, EyeOff, Lock, UserRound } from "lucide-react";
import "./LoginCard.css";

export function LoginCardMesa() {
  const { login } = useAuth();
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
      await login(identifier, password);
      window.location.replace("/menu");
    } catch {
      setError("Credenciales inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <button
        type="button"
        className="auth-home-button"
        onClick={() => window.location.replace("/")}
        aria-label="Volver al inicio"
      >
        <img src="/images/home-icon.png" alt="" />
      </button>

      <section className="login-page__left">
        <div className="login-page__home-logo-decor" aria-hidden="true">
          <img
            className="login-page__home-logo"
            src="/images/image-overlay.webp"
            alt=""
          />
        </div>
      </section>

      <section className="login-page__right">
        <div className="login-card">
          <form onSubmit={handleSubmit} className="form-content">
            <div className="title">INGRESAR</div>
            {error && <p className="error-text">{error}</p>}
            <div className="input-box-container">
              <div className="input-box">
                <span className="input-leading-icon" aria-hidden="true">
                  <UserRound size={18} />
                </span>
                <input
                  placeholder="Usuario"
                  required
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
              <div className="input-box">
                <span className="input-leading-icon" aria-hidden="true">
                  <Lock size={18} />
                </span>
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
              <button
                className="button-entrar"
                type="submit"
                disabled={loading}
              >
                {loading ? "Ingresando..." : "Entrar"}
              </button>
            </div>
            <p className="login-context-note">
              <CircleAlert size={16} aria-hidden="true" />
              Este acceso es exclusivo para cuentas de mesa dentro del restaurante.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
