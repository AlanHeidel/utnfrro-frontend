import { useState } from "react";
import { useAuth } from "../../context/auth.jsx";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { registerClient } from "../../api/auth";
import "./LoginCard.css";
import "./LoginCardReserva.css";

export function LoginCardReserva() {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const isRegisterMode = mode === "register";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPasswords, setShowRegisterPasswords] = useState(false);

  const [registerData, setRegisterData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerInfo, setRegisterInfo] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setRegisterInfo("");
    setLoading(true);
    try {
      await login(identifier, password);
      window.location.replace("/reservas");
    } catch {
      setError("Credenciales inválidas.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterInfo("");

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Las contrasenas no coinciden.");
      return;
    }
    try {
      await registerClient({
        nombre: registerData.nombre.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
      });

      try {
        await login(
          registerData.email.trim(),
          registerData.password,
        );
        window.location.replace("/reservas");
      } catch {
        setMode("login");
        setError("Cuenta creada. Inicia sesion para continuar.");
      }
    } catch (err) {
      const backendMessage =
        err?.response?.data?.message || "No pudimos crear la cuenta.";
      setRegisterError(String(backendMessage));
    }
  };

  const goToRegister = () => {
    setMode("register");
    setError("");
  };

  const goToLogin = () => {
    setMode("login");
    setRegisterError("");
    setRegisterInfo("");
  };

  const handleRegisterChange = (field) => (e) => {
    const value = e.target.value;
    setRegisterData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className={`reservas-auth ${isRegisterMode ? "is-register" : "is-login"}`}
    >
      <button
        type="button"
        className="auth-home-button"
        onClick={() => window.location.replace("/")}
        aria-label="Volver al inicio"
      >
        <img src="/images/home-icon.png" alt="" />
      </button>

      <section className="reservas-auth__panel reservas-auth__panel--icon">
        <div className="reservas-auth__home-logo-decor" aria-hidden="true">
          <img
            className="reservas-auth__home-logo"
            src="/images/image-overlay.webp"
            alt=""
          />
        </div>
        <div
          className="reservas-auth__pill-selector"
          role="tablist"
          aria-label="Tipo de acceso"
        >
          <button
            type="button"
            role="tab"
            aria-selected={isRegisterMode}
            className={`reservas-auth__pill ${isRegisterMode ? "is-active" : ""}`}
            onClick={goToRegister}
          >
            Registrarte
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isRegisterMode}
            className={`reservas-auth__pill ${!isRegisterMode ? "is-active" : ""}`}
            onClick={goToLogin}
          >
            Ingresar
          </button>
        </div>
      </section>

      <section className="reservas-auth__panel reservas-auth__panel--form">
        <div className="login-card reservas-auth__card">
          {!isRegisterMode ? (
            <form onSubmit={handleLoginSubmit} className="form-content">
              <div className="title">INGRESAR</div>
              {error && <p className="error-text">{error}</p>}
              <div className="input-box-container">
                <div className="input-box">
                  <span className="input-leading-icon" aria-hidden="true">
                    <Mail size={18} />
                  </span>
                  <input
                    placeholder="Email"
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
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Contrasena"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                  >
                    {showLoginPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
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
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="form-content">
              <div className="title">REGISTRARSE</div>
              {registerError && <p className="error-text">{registerError}</p>}
              {registerInfo && (
                <p className="reservas-auth__info">{registerInfo}</p>
              )}
              <div className="input-box-container">
                <div className="input-box">
                  <span className="input-leading-icon" aria-hidden="true">
                    <UserRound size={18} />
                  </span>
                  <input
                    placeholder="Nombre"
                    required
                    value={registerData.nombre}
                    onChange={handleRegisterChange("nombre")}
                  />
                </div>
                <div className="input-box">
                  <span className="input-leading-icon" aria-hidden="true">
                    <Mail size={18} />
                  </span>
                  <input
                    placeholder="Email"
                    required
                    autoComplete="username"
                    value={registerData.email}
                    onChange={handleRegisterChange("email")}
                  />
                </div>
                <div className="input-box">
                  <span className="input-leading-icon" aria-hidden="true">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showRegisterPasswords ? "text" : "password"}
                    placeholder="Contrasena"
                    required
                    autoComplete="new-password"
                    value={registerData.password}
                    onChange={handleRegisterChange("password")}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowRegisterPasswords((prev) => !prev)}
                  >
                    {showRegisterPasswords ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                <div className="input-box">
                  <span className="input-leading-icon" aria-hidden="true">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showRegisterPasswords ? "text" : "password"}
                    placeholder="Confirmar contrasena"
                    required
                    autoComplete="new-password"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange("confirmPassword")}
                  />
                </div>
              </div>
              <div className="login-footer-container">
                <button className="button-entrar" type="submit">
                  Registrarme
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
