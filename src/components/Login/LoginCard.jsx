import "./LoginCard.css";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export function LoginCard({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="login-card" onClick={(e) => e.stopPropagation()}>
        <h1 className="title">Iniciar sesión</h1>
        <div className="input-box">
          <input placeholder="Usuario" required />
          <i className="fas fa-user"></i>
        </div>
        <div className="input-box">
          <input type="password" placeholder="Contraseña" required />
          <i className="fas fa-lock"></i>
        </div>
        <button className="button-entrar">Entrar</button>
      </div>
    </div>,
    document.body
  );
}
