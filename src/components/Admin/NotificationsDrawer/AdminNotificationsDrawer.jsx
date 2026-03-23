import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAdminNotifications } from "../../../hooks/useAdminNotifications.jsx";
import { NotificationCard } from "../Notifications/NotificationCard.jsx";
import "./AdminNotificationsDrawer.css";

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export function AdminNotificationsDrawer({ isOpen, onClose }) {
  const {
    notifications,
    loading,
    error,
    updatingId,
    updateStatus,
  } = useAdminNotifications();

  useEffect(() => {
    if (!isOpen) return undefined;

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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="admin-notifications-overlay" onClick={onClose}>
      <aside
        className="admin-notifications-drawer"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin-notifications-drawer__header">
          <h3>Notificaciones</h3>
          <button
            type="button"
            className="admin-notifications-drawer__close"
            onClick={onClose}
            aria-label="Cerrar panel de notificaciones"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="admin-notifications-drawer__body">
          {loading ? (
            <div className="admin-notifications-drawer__empty">
              Cargando notificaciones...
            </div>
          ) : error ? (
            <div className="admin-notifications-drawer__empty">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="admin-notifications-drawer__empty">
              No hay notificaciones por el momento.
            </div>
          ) : (
            <div className="admin-notifications-list">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  compact
                  disabled={updatingId === String(notification.id)}
                  onAttend={(id) => updateStatus(id, "attended")}
                  onCancel={(id) => updateStatus(id, "canceled")}
                />
              ))}
            </div>
          )}
        </div>
        <footer className="admin-notifications-drawer__footer">
          <Link
            to="/admin/notificaciones"
            className="admin-notifications-drawer__more-btn"
            onClick={onClose}
          >
            Ver todas las notificaciones
          </Link>
        </footer>
      </aside>
    </div>
  );
}
