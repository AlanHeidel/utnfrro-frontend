import { useMemo, useState, useEffect } from "react";
import { TopBar } from "../../components/Admin/TopBar/TopBar";
import { TableForm } from "../../components/Admin/Forms/TableForm/TableForm";
import {
  getMesas,
  createMesa,
  updateMesa,
  deleteMesa,
  getMozos,
} from "../../api/mesas";

const statusLabels = {
  ocupada: "Ocupada",
  reservada: "Reservada",
  disponible: "Disponible",
};

const statusClasses = {
  ocupada: "table-status--occupied",
  reservada: "table-status--reserved",
  disponible: "table-status--available",
};

function normalizeMesa(mesa) {
  return {
    id: mesa.id?.toString(),
    numeroMesa: mesa.numeroMesa,
    capacidad: mesa.capacidad ?? 0,
    lugar: mesa.lugar ?? "",
    estado: mesa.estado ?? "disponible",
    mozoId: mesa.mozo?.id?.toString() ?? "",
    mozoNombre: mesa.mozo ? `${mesa.mozo.nombre} ${mesa.mozo.apellido}` : "Sin asignar",
  };
}

export function CustomersManagement() {
  const [tables, setTables] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState(null);
  const [mozos, setMozos] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const openCreateForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleSubmitProduct = async (formData) => {
    try {
      const payload = {
        numeroMesa: Number(formData.numeroMesa),
        capacidad: Number(formData.capacidad),
        lugar: formData.lugar,
        estado: formData.estado,
        mozo: Number(formData.mozoId),
      };

      if (formData.id) {
        await updateMesa(formData.id, payload);
      } else {
        await createMesa(payload);
      }
      const data = await getMesas();
      setTables(data.map(normalizeMesa));
      handleCloseForm();
    } catch (error) {
      setError("No pudimos guardar la mesa");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteMesa(productId);
      setTables((prev) => prev.filter((product) => product.id !== productId));
    } catch (error) {
      setError("No pudimos eliminar la mesa");
    }
  };

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const data = await getMesas();
        if (alive) setTables(data.map(normalizeMesa));
      } catch (_) {
        if (alive) setTables([]);
      }
    };
    load();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    const loadMozos = async () => {
      try {
        const data = await getMozos();
        if (alive) setMozos(data);
      } catch (_) { if (alive) setMozos([]); }
    };
    loadMozos();
    return () => { alive = false; };
  }, []);

  const filteredTables = useMemo(() => {
    if (statusFilter === "all") return tables;
    return tables.filter((table) => table.estado === statusFilter);
  }, [tables, statusFilter]);

  const metrics = useMemo(() => {
    const total = tables.length || 0;
    const occupied = tables.filter(t => t.estado === "ocupada").length;
    const reserved = tables.filter(t => t.estado === "reservada").length;
    const free = tables.filter(t => t.estado === "disponible").length;

    const utilization = total > 0
      ? Math.round(((occupied + reserved) / total) * 100)
      : 0;

    return { occupied, reserved, free, utilization };
  }, [tables]);

  const order = ["disponible", "reservada", "ocupada"];
  const cycleStatus = async (tableId) => {
    const current = tables.find((t) => t.id === tableId);
    if (!current) return;

    const nextStatus = order[(order.indexOf(current.estado) + 1) % order.length];

    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, estado: nextStatus } : t))
    );

    try {
      await updateMesa(tableId, { estado: nextStatus });
    } catch (e) {
      const data = await getMesas();
      setTables(data.map(normalizeMesa));
    }
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
              <span className="metric-title">Mesas ocupadas:  </span>
              <strong>{metrics.occupied}</strong>
            </div>
            <div>
              <span className="metric-title">Reservas:  </span>
              <strong>{metrics.reserved}</strong>
            </div>
            <div>
              <span className="metric-title">Mesas libres:  </span>
              <strong>{metrics.free}</strong>
            </div>
            <div>
              <span className="metric-title">Total mesas:  </span>
              <strong>{tables.length}</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="tables-toolbar">
            <div className="toolbar-left">
              <button
                className={`filter-pill ${statusFilter === "all" ? "active" : ""
                  }`}
                onClick={() => setStatusFilter("all")}
              >
                Todas
              </button>
              {Object.entries(statusLabels).map(([value, label]) => (
                <button
                  key={value}
                  className={`filter-pill ${statusFilter === value ? "active" : ""
                    }`}
                  onClick={() => setStatusFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="toolbar-right">
              <button className="btn-primary" onClick={openCreateForm}>
                + Nueva mesa
              </button>
            </div>
          </div>

          {filteredTables.length === 0 ? (
            <div className="empty-state">
              No hay mesas con ese estado por el momento.
            </div>
          ) : (
            <div className="tables-container">
              {filteredTables.map((table) => (
                <article key={table.id} className="table-card">
                  <header className="table-card__header">
                    <h3>Mesa {table.numeroMesa}</h3>
                    <span
                      className={`table-status ${statusClasses[table.estado] ?? ""
                        }`}
                    >
                      {statusLabels[table.estado] ?? table.estado}
                    </span>
                  </header>

                  <div className="ubi-capacity">
                    <p className="product-tag">{table.lugar || "Sin ubicación"}</p>

                    <p className="muted">
                      Capacidad {table.capacidad}
                    </p>
                  </div>

                  <div className="table-card__meta">
                    <div>
                      <span className="metric-title">Mozo asignado</span>
                      <strong>{table.mozoNombre || "Sin asignar"}</strong>
                    </div>
                  </div>

                  {table.notes && (
                    <p className="table-card__notes">{table.notes}</p>
                  )}

                  <footer className="table-card__footer">
                    <div>
                      <button
                        className="btn-link danger"
                        onClick={() => handleDeleteProduct(table.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                    <div className="btn-tables-container">
                      <button className="btn-secondary" onClick={() => openEditForm(table)}>Editar</button>
                      <button
                        className="btn-primary"
                        onClick={() => cycleStatus(table.id)}
                      >
                        Cambiar estado
                      </button>
                    </div>

                  </footer>
                </article>
              ))}
            </div>
          )}
        </section>

        {isFormOpen && (
          <div className="dashboard-section">
            <h2>{editingProduct ? "Editar producto" : "Nuevo producto"}</h2>
            <TableForm
              initialValues={editingProduct}
              mozos={mozos}
              onCancel={handleCloseForm}
              onSubmit={handleSubmitProduct}
            />
          </div>
        )}

      </div>
    </div>
  );
}
