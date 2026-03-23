import { useMemo, useState } from "react";
import { TopBar } from "../../components/Admin/TopBar/TopBar";
import { useAdminNotifications } from "../../hooks/useAdminNotifications.jsx";
import { NotificationCard } from "../../components/Admin/Notifications/NotificationCard.jsx";

export function NotificationsManagement() {
  const {
    notifications,
    loading,
    error,
    updatingId,
    refreshNotifications,
    updateStatus,
  } = useAdminNotifications();

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((item) =>
        statusFilter === "all" ? true : item.estado === statusFilter,
      )
      .filter((item) => {
        if (!searchTerm.trim()) return true;
        const haystack = `${item.mesa?.numeroMesa ?? ""} ${item.message ?? ""}`
          .toLowerCase()
          .trim();
        return haystack.includes(searchTerm.trim().toLowerCase());
      });
  }, [notifications, statusFilter, searchTerm]);

  const metrics = useMemo(() => {
    return {
      total: notifications.length,
      pending: notifications.filter((item) => item.estado === "pending").length,
      attended: notifications.filter((item) => item.estado === "attended")
        .length,
      canceled: notifications.filter((item) => item.estado === "canceled")
        .length,
    };
  }, [notifications]);

  return (
    <div className="notifications-management">
      <TopBar
        title="Notificaciones"
        subtitle="Gestiona solicitudes de mozo en tiempo real"
      />

      <div className="orders-body">
        <section className="dashboard-section">
          <header className="section-header">
            <h2>Resumen</h2>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => refreshNotifications()}
            >
              Actualizar
            </button>
          </header>

          <div className="orders-metrics">
            <div>
              <span className="metric-title">Pendientes: </span>
              <strong>{metrics.pending}</strong>
            </div>
            <div>
              <span className="metric-title">Atendidas: </span>
              <strong>{metrics.attended}</strong>
            </div>
            <div>
              <span className="metric-title">Canceladas: </span>
              <strong>{metrics.canceled}</strong>
            </div>
            <div>
              <span className="metric-title">Total: </span>
              <strong>{metrics.total}</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <header className="orders-toolbar">
            <div className="toolbar-left">
              <input
                type="search"
                className="search-input"
                placeholder="Buscar por N° mesa"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="toolbar-right">
              {[
                { value: "all", label: "Todas" },
                { value: "pending", label: "Pendientes" },
                { value: "attended", label: "Atendidas" },
                { value: "canceled", label: "Canceladas" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  className={`filter-pill ${statusFilter === filter.value ? "active" : ""}`}
                  onClick={() => setStatusFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </header>

          {loading ? (
            <div className="empty-state">Cargando notificaciones...</div>
          ) : error ? (
            <div className="empty-state">{error}</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-state">
              No hay notificaciones con los criterios seleccionados.
            </div>
          ) : (
            <div className="admin-notifications-grid">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  disabled={updatingId === String(notification.id)}
                  onAttend={(id) => updateStatus(id, "attended")}
                  onCancel={(id) => updateStatus(id, "canceled")}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
