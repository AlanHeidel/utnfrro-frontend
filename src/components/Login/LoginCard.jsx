import { useAuth } from "../../context/auth.jsx";
import "./LoginCard.css";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { registerClient } from "../../api/auth";

export function LoginCard({ onClose }) {
  const [mode, setMode] = useState("login");
  const { login, type: authType, redirectPath, clearRedirectPath } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const isLogin = mode === "login";

  // reset campos cuando cambiamos de modo para evitar controlados/ no controlados
  useEffect(() => {
    if (isLogin) {
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
    } else {
      setIdentifier("");
      setPassword("");
    }
  }, [isLogin]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isLogin) return handleRegister(event);
    setError("");
    setLoading(true);
    try {
      const result = await login(identifier, password);
      const userType = result?.type ?? authType;
      const destination = (() => {
        if (userType === "admin") return "/admin";
        if (userType === "table-device") return "/menu";
        if (userType === "client") return "/reservas";
        return redirectPath || "/";
      })();
      clearRedirectPath();
      navigate(destination, { replace: true });
      onClose();
    } catch (err) {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerClient({ name: registerName, email: registerEmail, password: registerPassword });
      await login(registerEmail, registerPassword);
      const destination = "/reservas";
      clearRedirectPath();
      navigate(destination, { replace: true });
      onClose();
    } catch (err) {
      setError("No pudimos crear la cuenta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="login-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>

        <form onSubmit={handleSubmit} className="form-content">
          <h1 className="title">{isLogin ? "Iniciar sesión" : "Crear cuenta"}</h1>
          {error && <p className="error-text">{error}</p>}

          {isLogin ? (
            <>
              <div className="input-box-container">
                <div className="input-box">
                  <input
                    placeholder="Usuario o email"
                    name="username"
                    autoComplete="username"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                  <i className="fas fa-user"></i>
                </div>
                <div className="input-box">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <i className="fas fa-lock"></i>
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="login-footer-container">
                <button className="button-entrar" type="submit" disabled={loading}>
                  {loading ? "Ingresando..." : "Entrar"}
                </button>
                <p className="helper-text">
                  ¿No tenés cuenta?{" "}
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => setMode("register")}
                  >
                    Registrate
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="input-box-container">
                <div className="input-box">
                  <input
                    placeholder="Nombre y apellido"
                    autoComplete="name"
                    required
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                  />
                  <i className="fas fa-user"></i>
                </div>
                <div className="input-box">
                  <input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="input-box">
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    autoComplete="new-password"
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                  <i className="fas fa-lock"></i>
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowRegisterPassword((prev) => !prev)}
                    aria-label={showRegisterPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="login-footer-container">
                <button className="button-entrar" type="submit" disabled={loading}>
                  {loading ? "Registrando..." : "Registrarme"}
                </button>
                <p className="helper-text">
                  ¿Ya tenés cuenta?{" "}
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => setMode("login")}
                  >
                    Iniciar sesión
                  </button>
                </p>
              </div>
            </>
          )}
        </form>
      </div>
    </div>,
    document.body
  );
}
