import "./OrderCard.css";

const statusFlow = ["pending", "in_progress", "delivered"];

const statusLabels = {
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

function minutesSince(dateString) {
  const diff = (Date.now() - new Date(dateString).getTime()) / (1000 * 60) || 0;
  return Math.max(Math.round(diff), 0);
}

export function OrderCard({
  order,
  onStatusChange,
  onAdvanceStatus,
  onViewDetails,
  disabled = false,
}) {
  const currentIndex = statusFlow.indexOf(order.status);
  const nextStatus =
    currentIndex >= 0 && currentIndex < statusFlow.length - 1
      ? statusFlow[currentIndex + 1]
      : null;

  return (
    <article className={`order-card order-card--${order.status}`}>
      <header className="order-card__header">
        <div>
          <h3>{order.code} - Mesa {order.table}</h3>
        </div>
        <div className="order-card__status">
          <span className={`chip chip--${order.status}`}>
            {statusLabels[order.status] ?? order.status}
          </span>
          <time>{minutesSince(order.createdAt)} min</time>
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
        <select
          value={order.status}
          disabled={disabled}
          onChange={(event) =>
            onStatusChange(order.id, event.target.value || order.status)
          }
        >
          {statusFlow.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
          <option value="canceled">{statusLabels.canceled}</option>
        </select>

        <div className="order-card__actions">
          {nextStatus && (
            <button
              className="btn-primary"
              disabled={disabled}
              onClick={() => onAdvanceStatus(order.id, nextStatus)}
            >
              Avanzar a {statusLabels[nextStatus]}
            </button>
          )}
          <button
            className="btn-link"
            onClick={() => onViewDetails?.(order.id)}
          >
            Ver detalle
          </button>
        </div>
      </footer>
    </article>
  );
}
