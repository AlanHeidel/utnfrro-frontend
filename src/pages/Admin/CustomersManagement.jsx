import { useMemo, useState } from "react";
import { TopBar } from "../../components/Admin/TopBar/TopBar";

const initialTables = [
  {
    id: "T-01",
    number: "Mesa 1",
    capacity: 2,
    status: "occupied",
    waiter: "Romina",
    customers: 2,
    since: "2024-10-16T18:05:00Z",
    notes: "Pareja aniversario.",
  },
  {
    id: "T-02",
    number: "Mesa 2",
    capacity: 4,
    status: "reserved",
    waiter: "Lucas",
    customers: 0,
    since: "2024-10-16T18:30:00Z",
    notes: "Reserva 18:45 - Familia López.",
  },
  {
    id: "T-03",
    number: "Mesa 3",
    capacity: 6,
    status: "occupied",
    waiter: "Gonzalo",
    customers: 5,
    since: "2024-10-16T17:40:00Z",
    notes: "Sin frutos secos.",
  },
  {
    id: "T-04",
    number: "Mesa 4",
    capacity: 4,
    status: "cleaning",
    waiter: "",
    customers: 0,
    since: "2024-10-16T18:20:00Z",
    notes: "",
  },
  {
    id: "T-05",
    number: "Mesa 5",
    capacity: 2,
    status: "available",
    waiter: "",
    customers: 0,
    since: "2024-10-16T17:50:00Z",
    notes: "",
  },
];

const statusLabels = {
  occupied: "Ocupada",
  reserved: "Reservada",
  cleaning: "En limpieza",
  available: "Disponible",
};

const statusClasses = {
  occupied: "table-status--occupied",
  reserved: "table-status--reserved",
  cleaning: "table-status--cleaning",
  available: "table-status--available",
};

function minutesSince(dateString) {
  if (!dateString) return 0;
  const diff = (Date.now() - new Date(dateString).getTime()) / (1000 * 60) || 0;
  return Math.max(Math.round(diff), 0);
}

export function CustomersManagement() {
  const [tables, setTables] = useState(initialTables);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTables = useMemo(() => {
    if (statusFilter === "all") return tables;
    return tables.filter((table) => table.status === statusFilter);
  }, [tables, statusFilter]);

  const metrics = useMemo(() => {
    const occupied = tables.filter((table) => table.status === "occupied");
    const reserved = tables.filter((table) => table.status === "reserved");
    const capacityUsed = occupied.reduce(
      (acc, table) => acc + table.customers,
      0
    );
    const totalCapacity = tables.reduce(
      (acc, table) => acc + table.capacity,
      0
    );

    return {
      occupied: occupied.length,
      reserved: reserved.length,
      free: tables.filter((table) => table.status === "available").length,
      utilization: Math.round((capacityUsed / totalCapacity) * 100),
    };
  }, [tables]);

  const cycleStatus = (tableId) => {
    setTables((prev) =>
      prev.map((table) => {
        if (table.id !== tableId) return table;

        const order = ["available", "reserved", "occupied", "cleaning"];
        const currentIndex = order.indexOf(table.status);
        const nextStatus = order[(currentIndex + 1) % order.length];

        return {
          ...table,
          status: nextStatus,
          customers: nextStatus === "occupied" ? table.capacity : 0,
          waiter:
            nextStatus === "occupied" ? table.waiter || "Sin asignar" : "",
          since: new Date().toISOString(),
        };
      })
    );
  };

  return (
    <div className="tables-management">
      <TopBar
        title="Mesas y clientes"
        subtitle="Controla la ocupación y el estado del salón"
      />

      <div className="tables-body">
        <section className="dashboard-section">
          <header className="section-header">
            <h2>Ocupación del salón</h2>
            <span className="chip status-featured badge-large">
              Ocupación {metrics.utilization || 0}%
            </span>
          </header>

          <div className="tables-metrics">
            <div>
              <span className="metric-title">Mesas ocupadas</span>
              <strong>{metrics.occupied}</strong>
            </div>
            <div>
              <span className="metric-title">Reservas</span>
              <strong>{metrics.reserved}</strong>
            </div>
            <div>
              <span className="metric-title">Mesas libres</span>
              <strong>{metrics.free}</strong>
            </div>
            <div>
              <span className="metric-title">Total mesas</span>
              <strong>{tables.length}</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="tables-toolbar">
            <div className="toolbar-right">
              <button
                className={`filter-pill ${
                  statusFilter === "all" ? "active" : ""
                }`}
                onClick={() => setStatusFilter("all")}
              >
                Todas
              </button>
              {Object.entries(statusLabels).map(([value, label]) => (
                <button
                  key={value}
                  className={`filter-pill ${
                    statusFilter === value ? "active" : ""
                  }`}
                  onClick={() => setStatusFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {filteredTables.length === 0 ? (
            <div className="empty-state">
              No hay mesas con ese estado por el momento.
            </div>
          ) : (
            <div className="tables-grid">
              {filteredTables.map((table) => (
                <article key={table.id} className="table-card">
                  <header className="table-card__header">
                    <h3>{table.number}</h3>
                    <span
                      className={`table-status ${
                        statusClasses[table.status] ?? ""
                      }`}
                    >
                      {statusLabels[table.status] ?? table.status}
                    </span>
                  </header>

                  <p className="muted">
                    Capacidad {table.capacity} · {table.customers} comensales
                  </p>

                  {table.status === "occupied" && (
                    <div className="table-card__meta">
                      <div>
                        <span className="metric-title">Mozo asignado</span>
                        <strong>{table.waiter || "Sin asignar"}</strong>
                      </div>
                      <div>
                        <span className="metric-title">Tiempo</span>
                        <strong>{minutesSince(table.since)} min</strong>
                      </div>
                    </div>
                  )}

                  {table.notes && (
                    <p className="table-card__notes">{table.notes}</p>
                  )}

                  <footer className="table-card__footer">
                    <button
                      className="btn-secondary"
                      onClick={() => cycleStatus(table.id)}
                    >
                      Cambiar estado
                    </button>
                    <button className="btn-link">Ver detalle</button>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
