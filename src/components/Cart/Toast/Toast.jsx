import { useEffect, useState } from "react";
import "./Toast.css";

export function Toast({ message, type = "success", onClose }) {
  const [isExiting, setIsExiting] = useState(false);
  const normalizedType =
    type === "error" || type === "info" || type === "success" ? type : "info";

  const typeConfig = {
    success: {
      title: "Exito",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      ),
    },
    error: {
      title: "Error",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-7 7M8.5 8.5l7 7" />
        </svg>
      ),
    },
    info: {
      title: "Info",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 16v-5M12 8h.01" />
        </svg>
      ),
    },
  };

  useEffect(() => {
    if (isExiting) return undefined;
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 3600);

    return () => clearTimeout(timer);
  }, [isExiting]);

  useEffect(() => {
    if (!isExiting) return undefined;
    const timer = setTimeout(() => {
      onClose();
    }, 360);

    return () => clearTimeout(timer);
  }, [isExiting, onClose]);

  const handleClose = () => setIsExiting(true);

  return (
    <div
      className={`toast toast-${normalizedType} ${isExiting ? "is-exiting" : ""}`}
      role={normalizedType === "error" ? "alert" : "status"}
      aria-live={normalizedType === "error" ? "assertive" : "polite"}
    >
      <div className="toast-icon">{typeConfig[normalizedType].icon}</div>

      <div className="toast-content">
        <strong className="toast-title">{typeConfig[normalizedType].title}</strong>
        <span className="toast-message">{message}</span>
      </div>

      <button className="toast-close" onClick={handleClose} aria-label="Cerrar toast">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  );
}
