import { useEffect } from "react";
import { X } from "lucide-react";
import "./AdminModal.css";

export function AdminModal({ title, onClose, children }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(event) => event.stopPropagation()}>
        <header className="admin-modal__header">
          <h3 className="admin-modal__title">{title}</h3>
          <button
            type="button"
            className="admin-modal__close-btn"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </header>
        <div className="admin-modal__body">{children}</div>
      </div>
    </div>
  );
}
