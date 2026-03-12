import "./OrderCard.css";

const statusLabels = {
  pending_payment: "Pendiente pago",
  pending: "Recibido",
  in_progress: "En cocina",
  delivered: "Entregado",
  canceled: "Cancelado",
};

function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
}

function formatElapsedTime(dateString) {
  const timestamp = new Date(dateString).getTime();
  if (!Number.isFinite(timestamp)) return "-";

  const diffMs = Math.max(Date.now() - timestamp, 0);
  const minutes = Math.floor(diffMs / (1000 * 60));

  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;

  const days = Math.floor(hours / 24);
  return `${days} d`;
}

function getNextStatus(status) {
  if (status === "pending") return "in_progress";
  if (status === "in_progress") return "delivered";
  return null;
}

function getAdvanceLabel(status) {
  if (status === "pending") return "Avanzar a cocina";
  if (status === "in_progress") return "Entregar";
  return "";
}

export function OrderCard({
  order,
  onStatusChange,
  onViewDetails,
  disabled = false,
}) {
  const canCancel = order.status !== "delivered" && order.status !== "canceled";
  const nextStatus = getNextStatus(order.status);
  const canAdvanceStatus = Boolean(nextStatus);

  return (
    <article className={`order-card order-card--${order.status}`}>
      <header className="order-card__header">
        <div>
          <h3>
            {order.code} - Mesa {order.table}
          </h3>
        </div>
        <div className="order-card__status">
          <span className={`chip chip--${order.status}`}>
            {statusLabels[order.status] ?? order.status}
          </span>
          <time>{formatElapsedTime(order.createdAt)}</time>
        </div>
      </header>

      <div className="order-card__body">
        <ul className="order-card__items">
          {order.items.map((item) => (
            <li key={item.id}>
              <span>
                {item.qty}× {item.name}
              </span>
              <strong>{formatCurrency(item.total)}</strong>
            </li>
          ))}
        </ul>

        {order.notes && <p className="order-card__notes">{order.notes}</p>}

        <dl className="order-card__meta">
          <div>
            <dt>Total</dt>
            <dd>{formatCurrency(order.total)}</dd>
          </div>

          <div>
            <dt>Mozo</dt>
            <dd>{order.waiter}</dd>
          </div>
        </dl>
      </div>

      <footer className="order-card__footer">
        <div className="order-card__actions">
          {canCancel && (
            <button
              type="button"
              className="btn-link danger order-card__cancel-link"
              disabled={disabled}
              onClick={() => onStatusChange(order.id, "canceled")}
            >
              Cancelar
            </button>
          )}
          <div className="order-card__btn-container">
            <button
              className="btn-link"
              onClick={() => onViewDetails?.(order.id)}
            >
              Ver detalle
            </button>
            {canAdvanceStatus && (
              <button
                type="button"
                className="btn-primary order-card__advance-btn"
                disabled={disabled}
                onClick={() => onStatusChange(order.id, nextStatus)}
              >
                {getAdvanceLabel(order.status)}
              </button>
            )}
          </div>
        </div>
      </footer>
    </article>
  );
}
