import { useEffect, useMemo, useState } from "react";
import { TopBar } from "../../components/Admin/TopBar/TopBar";
import { OrderCard } from "../../components/Admin/OrderCard/OrderCard";
import { getPedidos, updatePedidoEstado } from "../../api/pedidos";

const statusFilters = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Recibidos" },
  { value: "in_progress", label: "En cocina" },
  { value: "delivered", label: "Entregados" },
  { value: "canceled", label: "Cancelados" },
];

function formatMozo(mozo) {
  if (!mozo && mozo !== 0) return "Sin asignar";
  if (typeof mozo === "object") {
    const nombre = mozo?.nombre ?? "";
    const apellido = mozo?.apellido ?? "";
    const full = `${nombre} ${apellido}`.trim();
    return full || "Sin asignar";
  }
  return `Mozo #${mozo}`;
}

function normalizePedido(pedido) {
  const mesa = pedido.mesa ?? {};
  const mozoLabel = formatMozo(mesa.mozo);
  return {
    id: pedido.id?.toString() ?? crypto.randomUUID(),
    code: `Pedido #${pedido.id ?? "?"}`,
    table: mesa.numeroMesa?.toString() ?? "-",
    customer: pedido.cliente?.nombre
      ? `${pedido.cliente.nombre} ${pedido.cliente.apellido ?? ""}`.trim()
      : `Mesa ${mesa.numeroMesa ?? "-"}`,
    status: pedido.estado ?? "pending",
    type: "dine-in",
    waiter: mozoLabel,
    total: Number(pedido.total) || 0,
    notes: pedido.nota ?? "",
    createdAt: pedido.fechaHora ?? new Date().toISOString(),
    items:
      pedido.items?.map((item) => ({
        id: item.id?.toString() ?? crypto.randomUUID(),
        name: item.plato?.nombre ?? "Plato",
        qty: item.cantidad ?? 0,
        total: Number(item.precioUnitario ?? 0) * Number(item.cantidad ?? 0),
      })) ?? [],
  };
}

export function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getPedidos();
        if (alive) {
          setOrders(data.map(normalizePedido));
        }
      } catch (err) {
        if (alive) setError("No pudimos cargar los pedidos");
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) =>
        statusFilter === "all" ? true : order.status === statusFilter
      )
      .filter((order) => {
        if (!searchTerm) return true;
        const haystack = `${order.code} ${order.customer} ${order.table}`
          .toLowerCase()
          .trim();
        return haystack.includes(searchTerm.toLowerCase().trim());
      });
  }, [orders, statusFilter, searchTerm]);

  const metrics = useMemo(() => {
    const pending = orders.filter((o) => o.status === "pending").length;
    const inProgress = orders.filter((o) => o.status === "in_progress").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const total = orders.reduce((acc, order) => acc + order.total, 0);

    return { pending, inProgress, delivered, total };
  }, [orders]);

  const handleStatusChange = async (orderId, nextStatus) => {
    if (!nextStatus) return;
    setUpdatingOrderId(orderId);
    const previousOrders = orders;
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus } : order
      )
    );
    try {
      await updatePedidoEstado(orderId, nextStatus);
    } catch (error) {
      setOrders(previousOrders);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleAdvanceStatus = (orderId, nextStatus) => {
    handleStatusChange(orderId, nextStatus);
  };

  const handleViewDetails = (orderId) => {
    // pendiente los detalles de los pedidos
  };

  return (
    <div className="orders-management">
      <TopBar
        title="Pedidos activos"
        subtitle="Supervisa el flujo de pedidos en tiempo real"
      />

      <div className="orders-body">
        <section className="dashboard-section">
          <header className="section-header">
            <h2>Situación actual</h2>
            <div className="metrics-highlight">
              <span className="chip status-featured badge-large">
                Total del servicio: ${metrics.total.toLocaleString("es-AR")}
              </span>
            </div>
          </header>

          <div className="orders-metrics">
            <div>
              <span className="metric-title">Recibidos</span>
              <strong>{metrics.pending}</strong>
            </div>
            <div>
              <span className="metric-title">En cocina</span>
              <strong>{metrics.inProgress}</strong>
            </div>
            <div>
              <span className="metric-title">Entregados</span>
              <strong>{metrics.delivered}</strong>
            </div>
            <div>
              <span className="metric-title">Pedidos totales</span>
              <strong>{orders.length}</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <header className="orders-toolbar">
            <div className="toolbar-left">
              <input
                type="search"
                className="search-input"
                placeholder="Buscar por mesa o cliente"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="toolbar-right">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  className={`filter-pill ${statusFilter === filter.value ? "active" : ""
                    }`}
                  onClick={() => setStatusFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </header>

          {loading ? (
            <div className="empty-state">Cargando pedidos...</div>
          ) : error ? (
            <div className="empty-state">{error}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              No hay pedidos con los criterios seleccionados.
            </div>
          ) : (
            <div className="orders-grid">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={handleStatusChange}
                  onAdvanceStatus={handleAdvanceStatus}
                  onViewDetails={handleViewDetails}
                  disabled={updatingOrderId === order.id}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
