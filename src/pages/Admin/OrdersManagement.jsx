import { useMemo, useState } from "react";
import { TopBar } from "../../components/Admin/TopBar/TopBar";
import { OrderCard } from "../../components/Admin/OrderCard/OrderCard";

const initialOrders = [
  {
    id: "O-001",
    code: "#001 · Salón",
    table: "5",
    customer: "Lucía M.",
    status: "preparing",
    type: "dine-in",
    waiter: "Sofía",
    total: 4550,
    notes: "Sin cebolla en la hamburguesa.",
    createdAt: "2024-10-16T18:10:00Z",
    items: [
      { id: "i-1", name: "Hamburguesa PPA", qty: 2, total: 2400 },
      { id: "i-2", name: "Papas con cheddar", qty: 1, total: 850 },
      { id: "i-3", name: "Limonada", qty: 2, total: 1300 },
    ],
  },
  {
    id: "O-002",
    code: "#002 · Delivery",
    table: "Delivery",
    customer: "Martín R.",
    status: "pending",
    type: "delivery",
    waiter: "Romina",
    total: 6200,
    notes: "",
    createdAt: "2024-10-16T18:25:00Z",
    items: [
      { id: "i-4", name: "Pizza Margherita", qty: 1, total: 3550 },
      { id: "i-5", name: "Cheesecake frutos rojos", qty: 2, total: 2650 },
    ],
  },
  {
    id: "O-003",
    code: "#003 · Salón",
    table: "2",
    customer: "Diego S.",
    status: "ready",
    type: "dine-in",
    waiter: "Lucas",
    total: 3120,
    notes: "Cumpleaños. Llevar velas.",
    createdAt: "2024-10-16T17:58:00Z",
    items: [
      { id: "i-6", name: "Ensalada César", qty: 1, total: 2200 },
      { id: "i-7", name: "Agua con gas", qty: 2, total: 920 },
    ],
  },
  {
    id: "O-004",
    code: "#004 · Salón",
    table: "8",
    customer: "Mesa corporativa",
    status: "delivered",
    type: "dine-in",
    waiter: "Gonzalo",
    total: 10800,
    notes: "",
    createdAt: "2024-10-16T17:15:00Z",
    items: [
      { id: "i-8", name: "Pizza Cuatro Quesos", qty: 2, total: 7500 },
      { id: "i-9", name: "Cervezas artesanales", qty: 4, total: 3300 },
    ],
  },
];

const statusFilters = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Recibidos" },
  { value: "preparing", label: "En cocina" },
  { value: "ready", label: "Listos" },
  { value: "delivered", label: "En mesa" },
];

export function OrdersManagement() {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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
    const preparing = orders.filter((o) => o.status === "preparing").length;
    const ready = orders.filter((o) => o.status === "ready").length;
    const total = orders.reduce((acc, order) => acc + order.total, 0);

    return { pending, preparing, ready, total };
  }, [orders]);

  const handleStatusChange = (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus } : order
      )
    );
  };

  const handleAdvanceStatus = (orderId, nextStatus) => {
    handleStatusChange(orderId, nextStatus);
  };

  const handleViewDetails = (orderId) => {
    console.log("Ver detalle de", orderId);
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
              <strong>{metrics.preparing}</strong>
            </div>
            <div>
              <span className="metric-title">Listos</span>
              <strong>{metrics.ready}</strong>
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
                  className={`filter-pill ${
                    statusFilter === filter.value ? "active" : ""
                  }`}
                  onClick={() => setStatusFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </header>

          {filteredOrders.length === 0 ? (
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
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
