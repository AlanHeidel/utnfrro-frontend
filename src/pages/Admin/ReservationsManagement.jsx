import { useEffect, useMemo, useState } from "react";
import { TopBar } from "../../components/Admin/TopBar/TopBar";
import { cancelReserva, getReservas } from "../../api/reservas";

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

function normalizeStatus(rawStatus) {
  const normalized = String(rawStatus ?? "").trim().toLowerCase();
  if (!normalized) return "sin_estado";
  return normalized;
}

function formatStatusLabel(status) {
  const base = String(status ?? "").replaceAll("_", " ").trim();
  if (!base) return "Sin estado";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function getStatusClass(status) {
  const normalized = normalizeStatus(status);
  if (
    normalized.includes("activa") ||
    normalized.includes("confirm") ||
    normalized.includes("aprob")
  ) {
    return "table-status--available";
  }
  if (normalized.includes("cancel") || normalized.includes("rechaz")) {
    return "table-status--occupied";
  }
  return "table-status--reserved";
}

function normalizeReserva(raw) {
  const clienteNombre = [raw?.cliente?.nombre, raw?.cliente?.apellido]
    .filter(Boolean)
    .join(" ")
    .trim();
  const clienteDisplay =
    clienteNombre ||
    raw?.cliente?.email ||
    raw?.account?.identifier ||
    raw?.cuenta?.identifier ||
    "Cliente";

  return {
    id: raw?.id?.toString() ?? crypto.randomUUID(),
    inicio: raw?.inicio ?? raw?.fechaHora ?? raw?.start ?? null,
    fin: raw?.fin ?? raw?.end ?? null,
    observacion: raw?.observacion ?? "",
    estado: normalizeStatus(raw?.estado),
    mesaId: raw?.mesa?.id ?? raw?.mesaId ?? null,
    mesaNumero: raw?.mesa?.numeroMesa ?? raw?.mesaNumero ?? null,
    cliente: clienteDisplay,
  };
}

export function ReservationsManagement() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cancelingId, setCancelingId] = useState(null);

  const loadReservas = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getReservas();
      setReservas((Array.isArray(data) ? data : []).map(normalizeReserva));
    } catch (_) {
      setError("No pudimos cargar las reservas.");
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservas();
  }, []);

  const statusOptions = useMemo(() => {
    const allStatuses = Array.from(
      new Set(reservas.map((reserva) => reserva.estado).filter(Boolean)),
    );
    return ["all", ...allStatuses];
  }, [reservas]);

  const filteredReservas = useMemo(() => {
    return reservas
      .filter((reserva) =>
        statusFilter === "all" ? true : reserva.estado === statusFilter,
      )
      .filter((reserva) => {
        if (!searchTerm.trim()) return true;
        const tableLabel = reserva.mesaNumero
          ? `mesa ${reserva.mesaNumero}`
          : `mesa ${reserva.mesaId ?? ""}`;
        const haystack = `${reserva.cliente} ${tableLabel}`.toLowerCase();
        return haystack.includes(searchTerm.trim().toLowerCase());
      })
      .sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime());
  }, [reservas, searchTerm, statusFilter]);

  const metrics = useMemo(() => {
    const total = reservas.length;
    const active = reservas.filter((item) =>
      item.estado.includes("activa"),
    ).length;
    const canceled = reservas.filter((item) =>
      item.estado.includes("cancel"),
    ).length;
    const today = new Date().toISOString().slice(0, 10);
    const todayCount = reservas.filter((item) => String(item.inicio).startsWith(today))
      .length;

    return { total, active, canceled, todayCount };
  }, [reservas]);

  const handleCancelReserva = async (reservaId) => {
    setCancelingId(reservaId);
    setError("");
    try {
      await cancelReserva(reservaId);
      await loadReservas();
    } catch (_) {
      setError("No pudimos cancelar la reserva.");
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <div className="reservations-management">
      <TopBar
        title="Reservas"
        subtitle="Visualiza y gestiona las reservas del restaurante"
      />

      <div className="tables-body">
        <section className="dashboard-section">
          <header className="section-header">
            <h2>Resumen de reservas</h2>
            <span className="chip status-featured badge-large">
              Total reservas: {metrics.total}
            </span>
          </header>

          <div className="tables-metrics">
            <div>
              <span className="metric-title">Activas: </span>
              <strong>{metrics.active}</strong>
            </div>
            <div>
              <span className="metric-title">Canceladas: </span>
              <strong>{metrics.canceled}</strong>
            </div>
            <div>
              <span className="metric-title">Hoy: </span>
              <strong>{metrics.todayCount}</strong>
            </div>
            <div>
              <span className="metric-title">Mostradas: </span>
              <strong>{filteredReservas.length}</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <header className="orders-toolbar">
            <div className="toolbar-left">
              <input
                type="search"
                className="search-input"
                placeholder="Buscar por cliente o mesa"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="toolbar-right">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  className={`filter-pill ${statusFilter === status ? "active" : ""}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status === "all" ? "Todos" : formatStatusLabel(status)}
                </button>
              ))}
            </div>
          </header>

          {loading ? (
            <div className="empty-state">Cargando reservas...</div>
          ) : error ? (
            <div className="empty-state">{error}</div>
          ) : filteredReservas.length === 0 ? (
            <div className="empty-state">No hay reservas con esos filtros.</div>
          ) : (
            <div className="tables-container">
              {filteredReservas.map((reserva) => (
                <article key={reserva.id} className="table-card reservation-card">
                  <header className="table-card__header">
                    <h3>
                      {reserva.mesaNumero
                        ? `Mesa ${reserva.mesaNumero}`
                        : `Mesa ${reserva.mesaId ?? "-"}`}
                    </h3>
                    <span className={`table-status ${getStatusClass(reserva.estado)}`}>
                      {formatStatusLabel(reserva.estado)}
                    </span>
                  </header>

                  <div className="table-card__meta reservation-meta">
                    <div>
                      <span className="metric-title">Cliente</span>
                      <strong>{reserva.cliente}</strong>
                    </div>
                    <div>
                      <span className="metric-title">Inicio</span>
                      <strong>{formatDateTime(reserva.inicio)}</strong>
                    </div>
                    <div>
                      <span className="metric-title">Fin</span>
                      <strong>{formatDateTime(reserva.fin)}</strong>
                    </div>
                  </div>

                  {reserva.observacion ? (
                    <p className="table-card__notes">{reserva.observacion}</p>
                  ) : (
                    <p className="muted reservation-notes-empty">Sin observaciones</p>
                  )}

                  <footer className="table-card__footer">
                    <span className="muted">Reserva #{reserva.id}</span>
                    {!reserva.estado.includes("cancel") && (
                      <button
                        type="button"
                        className="btn-link danger"
                        onClick={() => handleCancelReserva(reserva.id)}
                        disabled={cancelingId === reserva.id}
                      >
                        {cancelingId === reserva.id ? "Cancelando..." : "Cancelar"}
                      </button>
                    )}
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

