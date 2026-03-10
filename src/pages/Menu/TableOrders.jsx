import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getPedidoForTable } from "../../api/pedidos";
import { useAuth } from "../../context/auth.jsx";
import "./TableOrders.css";

function getMesaIdFromToken(token) {
  if (!token || token.split(".").length < 3) return null;
  try {
    const claims = jwtDecode(token);
    const mesaId = Number(claims?.mesaId);
    return Number.isFinite(mesaId) && mesaId > 0 ? mesaId : null;
  } catch {
    return null;
  }
}

function getStatusLabel(status) {
  const normalized = String(status ?? "").toLowerCase();
  if (normalized.includes("pending")) return "Recibido";
  if (normalized.includes("progress")) return "En cocina";
  if (normalized.includes("deliver")) return "Entregado";
  if (normalized.includes("cancel")) return "Cancelado";
  return normalized ? normalized.replaceAll("_", " ") : "Sin estado";
}

function getStatusClass(status) {
  const normalized = String(status ?? "").toLowerCase();
  if (normalized.includes("deliver")) return "table-orders__status--done";
  if (normalized.includes("cancel")) return "table-orders__status--cancelled";
  if (normalized.includes("progress")) return "table-orders__status--progress";
  return "table-orders__status--pending";
}

function formatDateTime(value) {
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

function normalizePedido(pedido) {
  return {
    id: pedido?.id,
    estado: pedido?.estado ?? "",
    total: Number(pedido?.total ?? 0),
    fechaHora: pedido?.fechaHora ?? null,
    mesaNumero: pedido?.mesa?.numeroMesa ?? "-",
    items: Array.isArray(pedido?.items) ? pedido.items : [],
  };
}

export function TableOrders() {
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [hasActiveOrder, setHasActiveOrder] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError("");
    setHasActiveOrder(true);
    try {
      const mesaId = getMesaIdFromToken(token);
      if (!mesaId) {
        setOrder(null);
        setHasActiveOrder(false);
        setError("No pudimos identificar la mesa de esta cuenta.");
        return;
      }

      const pedido = await getPedidoForTable(mesaId);
      setOrder(normalizePedido(pedido));
    } catch (error) {
      const status = error?.response?.status;
      if (status === 404) {
        setOrder(null);
        setHasActiveOrder(false);
        return;
      }
      if (status === 403) {
        setOrder(null);
        setHasActiveOrder(false);
        setError("Este pedido no pertenece a tu mesa.");
        return;
      }
      setError("No pudimos cargar tus pedidos.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  return (
    <section className="table-orders">
      <header className="table-orders__header">
        <div>
          <h1>Tus pedidos</h1>
          <p>Consulta el estado y el detalle de lo que pediste desde tu mesa.</p>
        </div>
        <button type="button" className="table-orders__refresh" onClick={loadOrder}>
          Actualizar
        </button>
      </header>

      {loading ? (
        <div className="table-orders__empty">Cargando pedidos...</div>
      ) : error ? (
        <div className="table-orders__empty">{error}</div>
      ) : !hasActiveOrder || !order ? (
        <div className="table-orders__empty">
          <p>No hay un pedido activo para tu mesa.</p>
          <Link to="/menu" className="table-orders__back">
            Ir al menú
          </Link>
        </div>
      ) : (
        <div className="table-orders__grid">
          <article key={order.id} className="table-orders__card">
            <header className="table-orders__card-head">
              <div>
                <h2>Pedido #{order.id}</h2>
                <p>Mesa {order.mesaNumero}</p>
              </div>
              <span className={`table-orders__status ${getStatusClass(order.estado)}`}>
                {getStatusLabel(order.estado)}
              </span>
            </header>

            <p className="table-orders__date">{formatDateTime(order.fechaHora)}</p>

            <ul className="table-orders__items">
              {order.items.map((item) => (
                <li key={item.id ?? `${item.plato?.id}-${item.cantidad}`}>
                  <span>
                    {item.cantidad}x {item.plato?.nombre ?? "Plato"}
                  </span>
                  <strong>
                    ${(Number(item.precioUnitario ?? 0) * Number(item.cantidad ?? 0)).toFixed(2)}
                  </strong>
                </li>
              ))}
            </ul>

            <footer className="table-orders__footer">
              <span>Total</span>
              <strong>${order.total.toFixed(2)}</strong>
            </footer>
          </article>
        </div>
      )}
    </section>
  );
}
