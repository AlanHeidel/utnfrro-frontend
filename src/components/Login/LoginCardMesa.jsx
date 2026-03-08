import { useState } from "react";
import { useAuth } from "../../context/auth.jsx";
import { BookOpen, Eye, EyeOff } from "lucide-react";
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
      <section className="login-page__left">
        <div className="login-page__icon-shell" aria-hidden="true">
          <BookOpen />
        </div>
      </section>

      <section className="login-page__right">
        <div className="login-card">
          <form onSubmit={handleSubmit} className="form-content">
            <h1 className="title">Acceso Mesa</h1>
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
