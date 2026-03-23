import "./NotificationCard.css";

function formatStatus(status) {
  const normalized = String(status ?? "")
    .trim()
    .toLowerCase();
  if (normalized === "pending") return "PENDIENTE";
  if (normalized === "attended") return "ATENDIDA";
  if (normalized === "canceled") return "CANCELADA";
  return "SIN ESTADO";
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NotificationCard({
  notification,
  onAttend,
  onCancel,
  disabled = false,
  compact = false,
}) {
  const mesaNumero = notification?.mesa?.numeroMesa;
  const status = String(notification?.estado ?? "pending").toLowerCase();
  const isPending = status === "pending";
  const displayMessage = mesaNumero
    ? `Solicita atención la mesa ${mesaNumero}`
    : (notification?.message ?? "Solicitud de mozo");

  return (
    <article
      className={`admin-notification-card ${compact ? "is-compact" : ""}`}
      aria-live="polite"
    >
      <header className="admin-notification-card__header">
        <div>
          <h2 className="admin-notification-card__title">
            Mesa {mesaNumero ?? "-"}
          </h2>
          <p className="admin-notification-card__date">
            {formatDate(notification?.createdAt)}
          </p>
        </div>
        <span
          className={`admin-notification-chip admin-notification-chip--${status}`}
        >
          {formatStatus(status)}
        </span>
      </header>

      <p className="admin-notification-card__message">{displayMessage}</p>

      {isPending ? (
        <div className="admin-notification-card__actions">
          <button
            type="button"
            className="btn-link danger"
            onClick={() => onCancel?.(notification.id)}
            disabled={disabled}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-primary admin-notification-card__btn-primary"
            onClick={() => onAttend?.(notification.id)}
            disabled={disabled}
          >
            Marcar atendida
          </button>
        </div>
      ) : null}
    </article>
  );
}
