import { useState } from "react";
import { useAuth } from "../../context/auth.jsx";
import { CalendarDays, Eye, EyeOff } from "lucide-react";
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

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterInfo("");

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Las contrasenas no coinciden.");
      return;
    }

    setRegisterInfo("Registro pendiente de integracion con backend.");
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
    <div className={`reservas-auth ${isRegisterMode ? "is-register" : "is-login"}`}>
      <section className="reservas-auth__panel reservas-auth__panel--icon">
        <div className="reservas-auth__icon-shell" aria-hidden="true">
          <CalendarDays />
        </div>
      </section>

      <section className="reservas-auth__panel reservas-auth__panel--form">
        <div className="login-card reservas-auth__card">
          {!isRegisterMode ? (
            <form onSubmit={handleLoginSubmit} className="form-content">
              <h1 className="title">Iniciar sesion</h1>
              {error && <p className="error-text">{error}</p>}
              <div className="input-box-container">
                <div className="input-box">
                  <input
                    placeholder="Email"
                    required
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
                <div className="input-box">
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
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="login-footer-container">
                <button className="button-entrar" type="submit" disabled={loading}>
                  {loading ? "Ingresando..." : "Entrar"}
                </button>
                <p className="reservas-auth__switch-line">
                  No tienes cuenta?
                  <button
                    type="button"
                    className="reservas-auth__switch-button"
                    onClick={goToRegister}
                  >
                    Registrate aqui
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="form-content">
              <h1 className="title">Crear cuenta</h1>
              {registerError && <p className="error-text">{registerError}</p>}
              {registerInfo && <p className="reservas-auth__info">{registerInfo}</p>}
              <div className="input-box-container">
                <div className="input-box">
                  <input
                    placeholder="Nombre"
                    required
                    value={registerData.nombre}
                    onChange={handleRegisterChange("nombre")}
                  />
                </div>
                <div className="input-box">
                  <input
                    placeholder="Email"
                    required
                    autoComplete="username"
                    value={registerData.email}
                    onChange={handleRegisterChange("email")}
                  />
                </div>
                <div className="input-box">
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
                    {showRegisterPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="input-box">
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
                <button
                  type="button"
                  className="reservas-auth__switch-button reservas-auth__switch-button--standalone"
                  onClick={goToLogin}
                >
                  Ya tienes cuenta? Inicia sesion
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
