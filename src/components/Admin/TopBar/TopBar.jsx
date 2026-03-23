import { useState } from "react";
import "./TopBar.css";
import { AdminNotificationsDrawer } from "../NotificationsDrawer/AdminNotificationsDrawer";
import { useAdminNotifications } from "../../../hooks/useAdminNotifications.jsx";

// Iconos SVG
const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

export function TopBar({ title, subtitle }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { pendingCount } = useAdminNotifications();

  return (
    <>
      <div className="admin-topbar">
        <div className="topbar-content">
          <div className="topbar-title">
            <h1>{title}</h1>
            {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
          </div>
          <div className="topbar-actions">
            <button
              className="topbar-btn notification-btn"
              type="button"
              onClick={() => setNotificationsOpen(true)}
              aria-label="Abrir notificaciones"
            >
              <BellIcon />
              <span className="notification-badge">
                {pendingCount > 99 ? "99+" : pendingCount}
              </span>
            </button>
          </div>
        </div>
      </div>
      <AdminNotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
}
