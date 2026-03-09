import "./Reservas.css";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "../hooks/useToast.jsx";
import {
  cancelReserva,
  createReserva,
  getDisponibilidad,
  getReservas,
} from "../api/reservas";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeHour(raw) {
  if (!raw) return null;
  const str = String(raw).trim();
  const match = str.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const hh = match[1].padStart(2, "0");
  const mm = Number(match[2]) >= 30 ? "30" : "00";
  return `${hh}:${mm}`;
}

function normalizeInicio(raw, fallbackDate = "") {
  if (!raw) return null;
  const value = String(raw).trim();

  const hourOnly = normalizeHour(value);
  if (hourOnly && fallbackDate) {
    return `${fallbackDate}T${hourOnly}:00-03:00`;
  }

  const isoMatch = value.match(
    /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::\d{2}(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?$/,
  );
  if (!isoMatch) return null;

  const [, date, hh, mm, tz] = isoMatch;
  const normalizedMin = Number(mm) >= 30 ? "30" : "00";
  const offset = tz && tz !== "Z" ? tz : "-03:00";
  return `${date}T${hh}:${normalizedMin}:00${offset}`;
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

function formatTimeOnly(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
}

function formatDateOnly(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getReservaStatusClass(status) {
  const normalized = String(status ?? "").toLowerCase();
  if (normalized.includes("activ")) return "status--confirmed";
  if (normalized.includes("aprobad")) return "status--confirmed";
  if (normalized.includes("confirm")) return "status--confirmed";
  if (normalized.includes("cancel")) return "status--cancelled";
  if (normalized.includes("rechaz")) return "status--cancelled";
  return "status--pending";
}

function getReservaStatusLabel(status) {
  const raw = String(status ?? "").trim();
  if (!raw) return "Sin estado";
  const formatted = raw.replaceAll("_", " ").toLowerCase();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function normalizeReserva(raw) {
  const mesaId = raw?.mesaId ?? raw?.mesa?.id ?? null;
  const mesaNumero = raw?.mesa?.numeroMesa ?? raw?.mesaNumero ?? null;
  return {
    id: raw?.id,
    inicio: raw?.inicio ?? raw?.start ?? raw?.fechaHora ?? null,
    fin: raw?.fin ?? raw?.end ?? null,
    observacion: raw?.observacion ?? "",
    estado: raw?.estado ?? "",
    mesaId,
    mesaNumero,
  };
}

function toDisponibilidadSlots(payload, fecha) {
  const slots = [];

  const parseMesaId = (rawMesaId) => {
    if (rawMesaId === null || rawMesaId === undefined) return null;
    if (typeof rawMesaId === "number") {
      return Number.isFinite(rawMesaId) && rawMesaId > 0 ? rawMesaId : null;
    }
    if (typeof rawMesaId === "string") {
      const trimmed = rawMesaId.trim();
      if (!trimmed) return null;
      const direct = Number(trimmed);
      if (Number.isFinite(direct) && direct > 0) return direct;
      const match = trimmed.match(/(\d+)/);
      if (match) {
        const extracted = Number(match[1]);
        if (Number.isFinite(extracted) && extracted > 0) return extracted;
      }
    }
    return null;
  };

  const pushSlot = (mesaId, inicioRaw, mesaLabelRaw) => {
    const mesaNumber = parseMesaId(mesaId);
    if (!mesaNumber) return;
    const inicio = normalizeInicio(inicioRaw, fecha);
    if (!inicio) return;
    slots.push({
      id: `${mesaNumber}-${inicio}`,
      mesaId: mesaNumber,
      inicio,
      mesaLabel: mesaLabelRaw || `Mesa ${mesaNumber}`,
      horaLabel: formatDateTime(inicio),
    });
  };

  // Fast-path para el formato actual del backend:
  // { data?: { slots: [{ inicio, mesasDisponibles: [{ id, numeroMesa }] }] } }
  const directRoot = payload?.slots ? payload : payload?.data;
  if (Array.isArray(directRoot?.slots)) {
    directRoot.slots.forEach((slot) => {
      const inicioRaw =
        slot?.inicio ?? slot?.start ?? slot?.fechaHora ?? slot?.hora ?? slot?.horario;
      if (!inicioRaw || !Array.isArray(slot?.mesasDisponibles)) return;

      slot.mesasDisponibles.forEach((mesa) => {
        const mesaIdFromItem =
          mesa?.id ?? mesa?.mesaId ?? mesa?.idMesa ?? mesa?.numeroMesa;
        const mesaNumero = mesa?.numeroMesa ?? mesaIdFromItem;
        const mesaLabel = mesaNumero ? `Mesa ${mesaNumero}` : "";
        pushSlot(mesaIdFromItem, inicioRaw, mesaLabel);
      });
    });

    if (slots.length) {
      const dedup = new Map();
      slots.forEach((slot) => dedup.set(slot.id, slot));
      return [...dedup.values()].sort(
        (a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime(),
      );
    }
  }

  const walk = (node, inheritedMesa) => {
    if (!node) return;

    if (Array.isArray(node)) {
      node.forEach((item) => walk(item, inheritedMesa));
      return;
    }

    if (typeof node === "string") {
      pushSlot(inheritedMesa, node, inheritedMesa ? `Mesa ${inheritedMesa}` : "");
      return;
    }

    if (typeof node !== "object") return;

    const mesaId =
      node.mesaId ??
      node.idMesa ??
      node.mesa_id ??
      node.tableId ??
      node.table_id ??
      node.mesa?.id ??
      (node.numeroMesa !== undefined || node.mesa?.numeroMesa !== undefined
        ? node.id ?? node.numeroMesa ?? node.mesa?.numeroMesa
        : null) ??
      inheritedMesa;
    const mesaLabel =
      node.mesa?.numeroMesa
        ? `Mesa ${node.mesa.numeroMesa}`
        : node.numeroMesa
          ? `Mesa ${node.numeroMesa}`
          : mesaId
            ? `Mesa ${mesaId}`
            : "";

    if (Array.isArray(node.horarios)) {
      node.horarios.forEach((hora) => pushSlot(mesaId, hora, mesaLabel));
    }
    if (Array.isArray(node.horariosDisponibles)) {
      node.horariosDisponibles.forEach((hora) => pushSlot(mesaId, hora, mesaLabel));
    }
    if (Array.isArray(node.turnos)) {
      node.turnos.forEach((hora) => pushSlot(mesaId, hora, mesaLabel));
    }

    // Formato principal del backend:
    // slots: [{ inicio, mesasDisponibles: [{ id, numeroMesa, capacidad }] }]
    if (
      Array.isArray(node.mesasDisponibles) &&
      (node.inicio || node.start || node.fechaHora || node.hora || node.horario)
    ) {
      const inicioRaw =
        node.inicio ?? node.start ?? node.fechaHora ?? node.hora ?? node.horario;
      node.mesasDisponibles.forEach((mesa) => {
        const mesaIdFromItem =
          mesa?.id ?? mesa?.mesaId ?? mesa?.idMesa ?? mesa?.numeroMesa;
        const mesaNumero = mesa?.numeroMesa ?? mesaIdFromItem;
        const mesaItemLabel = mesaNumero ? `Mesa ${mesaNumero}` : "";
        pushSlot(mesaIdFromItem, inicioRaw, mesaItemLabel);
      });
    }

    if (node.inicio || node.start || node.fechaHora || node.hora || node.horario) {
      const inicioRaw =
        node.inicio ?? node.start ?? node.fechaHora ?? node.hora ?? node.horario;
      pushSlot(mesaId, inicioRaw, mesaLabel);
    }

    if (node.data) walk(node.data, mesaId);
    if (node.disponibilidad) walk(node.disponibilidad, mesaId);
    if (node.slots) walk(node.slots, mesaId);
    if (node.horarios && !Array.isArray(node.horarios)) walk(node.horarios, mesaId);
    if (node.horariosDisponibles && !Array.isArray(node.horariosDisponibles)) {
      walk(node.horariosDisponibles, mesaId);
    }
    if (node.result) walk(node.result, mesaId);

    // Soporta formato mapa: { "3": ["18:00","20:00"], "5": [...] }
    const knownKeys = new Set([
      "mesaId",
      "idMesa",
      "mesa_id",
      "tableId",
      "table_id",
      "mesa",
      "id",
      "numeroMesa",
      "horarios",
      "horariosDisponibles",
      "turnos",
      "mesasDisponibles",
      "cantidadMesasDisponibles",
      "inicio",
      "start",
      "fechaHora",
      "hora",
      "horario",
      "data",
      "disponibilidad",
      "slots",
      "result",
    ]);

    Object.entries(node).forEach(([key, value]) => {
      if (knownKeys.has(key)) return;
      const keyMesa = parseMesaId(key);
      if (keyMesa) walk(value, keyMesa);
    });
  };

  walk(payload, null);

  const dedup = new Map();
  slots.forEach((slot) => dedup.set(slot.id, slot));
  return [...dedup.values()].sort(
    (a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime(),
  );
}

export function Reservas() {
  const { showToast } = useToast();
  const [fecha, setFecha] = useState(getToday);
  const [personas, setPersonas] = useState(2);
  const [observacion, setObservacion] = useState("");

  const [reservas, setReservas] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");

  const [loadingReservas, setLoadingReservas] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancelingId, setCancelingId] = useState(null);

  const [reservasError, setReservasError] = useState("");
  const [slotsError, setSlotsError] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedSlotId) ?? null,
    [slots, selectedSlotId],
  );

  const loadReservas = async () => {
    setLoadingReservas(true);
    setReservasError("");
    try {
      const data = await getReservas();
      setReservas(data.map(normalizeReserva));
    } catch (err) {
      setReservasError(err?.response?.data?.message || "No pudimos cargar tus reservas.");
    } finally {
      setLoadingReservas(false);
    }
  };

  useEffect(() => {
    loadReservas();
  }, []);

  const handleBuscarDisponibilidad = async () => {
    if (!fecha || !personas) {
      setSlotsError("Completa fecha y cantidad de personas.");
      return;
    }

    setLoadingSlots(true);
    setSlotsError("");
    setFormError("");
    setFormSuccess("");

    try {
      const data = await getDisponibilidad(fecha, Number(personas));
      const parsed = toDisponibilidadSlots(data, fecha);
      setSlots(parsed);
      setSelectedSlotId(parsed[0]?.id ?? "");
      if (!parsed.length) {
        setSlotsError("No hay horarios disponibles para esa fecha y cantidad.");
      }
    } catch (err) {
      setSlotsError(
        err?.response?.data?.message || "No pudimos consultar disponibilidad.",
      );
      setSlots([]);
      setSelectedSlotId("");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleCloseSlots = () => {
    setSlots([]);
    setSelectedSlotId("");
    setSlotsError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!selectedSlot) {
      setFormError("Selecciona un horario disponible para continuar.");
      return;
    }

    setSubmitting(true);
    try {
      await createReserva({
        mesaId: selectedSlot.mesaId,
        inicio: normalizeInicio(selectedSlot.inicio, fecha),
        observacion: observacion.trim() || undefined,
      });
      setFormSuccess("Reserva creada correctamente.");
      showToast("Reserva solicitada correctamente.", "success");
      setObservacion("");
      await loadReservas();
      await handleBuscarDisponibilidad();
    } catch (err) {
      setFormError(err?.response?.data?.message || "No pudimos crear la reserva.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelReserva = async (id) => {
    setCancelingId(id);
    try {
      await cancelReserva(id);
      await loadReservas();
      if (slots.length > 0) await handleBuscarDisponibilidad();
    } catch (err) {
      setReservasError(
        err?.response?.data?.message || "No pudimos cancelar la reserva.",
      );
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <section className="reservas-page">
      <div className="reservas-page__grid">
        <article className="reservas-card reservas-card--form">
          <h2>Nueva reserva</h2>
          <p className="reservas-muted">Busca horarios disponibles y confirma tu reserva.</p>
          <form className="reservas-form" onSubmit={handleSubmit}>
            <label className="reservas-form__field">
              Fecha
              <input
                type="date"
                value={fecha}
                min={getToday()}
                onChange={(event) => setFecha(event.target.value)}
              />
            </label>
            <label className="reservas-form__field">
              Personas
              <select
                value={personas}
                onChange={(event) => setPersonas(Number(event.target.value))}
              >
                <option value="1">1 persona</option>
                <option value="2">2 personas</option>
                <option value="3">3 personas</option>
                <option value="4">4 personas</option>
                <option value="5">5 personas</option>
                <option value="6">6 personas</option>
                <option value="7">7 personas</option>
                <option value="8">8 personas</option>
              </select>
            </label>

            <div className="reservas-form__full">
              <button
                type="button"
                className="reservas-btn reservas-btn--secondary"
                onClick={handleBuscarDisponibilidad}
                disabled={loadingSlots}
              >
                {loadingSlots ? "Buscando horarios..." : "Ver horarios disponibles"}
              </button>
            </div>

            {slotsError && <p className="reservas-alert reservas-alert--error">{slotsError}</p>}

            {slots.length > 0 && (
              <div className="reservas-form__full reservas-slots">
                <div className="reservas-slots__header">
                  <p className="reservas-slots__title">Horarios disponibles</p>
                  <button
                    type="button"
                    className="reservas-slots__close"
                    onClick={handleCloseSlots}
                    aria-label="Cerrar horarios disponibles"
                  >
                    ×
                  </button>
                </div>
                <div className="reservas-slots__list">
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      className={`reservas-slot ${selectedSlotId === slot.id ? "is-selected" : ""}`}
                      onClick={() => setSelectedSlotId(slot.id)}
                    >
                      <strong>{formatTimeOnly(slot.inicio)}</strong>
                      <span>
                        {formatDateOnly(slot.inicio)} · {slot.mesaLabel}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <label className="reservas-form__field reservas-form__full">
              Comentarios
              <textarea
                rows={3}
                placeholder="Alergias, preferencia de mesa, etc."
                value={observacion}
                onChange={(event) => setObservacion(event.target.value)}
              />
            </label>

            {formError && <p className="reservas-alert reservas-alert--error">{formError}</p>}
            {formSuccess && <p className="reservas-alert reservas-alert--success">{formSuccess}</p>}

            <button
              type="submit"
              className="reservas-btn reservas-btn--primary reservas-form__full"
              disabled={submitting}
            >
              {submitting ? "Creando reserva..." : "Solicitar reserva"}
            </button>
          </form>
        </article>

        <article className="reservas-card">
          <h2>Estado de tus solicitudes</h2>
          {reservasError && <p className="reservas-alert reservas-alert--error">{reservasError}</p>}
          {loadingReservas ? (
            <p className="reservas-muted">Cargando reservas...</p>
          ) : reservas.length === 0 ? (
            <p className="reservas-muted">Todavia no tienes reservas.</p>
          ) : (
            <ul className="reservas-list">
              {reservas.map((reserva) => (
                <li key={reserva.id}>
                  <div>
                    <strong>
                      {reserva.mesaNumero ? `Mesa ${reserva.mesaNumero}` : `Mesa ${reserva.mesaId ?? "-"}`}
                    </strong>
                    <span>Inicio: {formatDateTime(reserva.inicio)}</span>
                    {reserva.fin && <span>Fin: {formatDateTime(reserva.fin)}</span>}
                    {reserva.observacion && <span>Obs: {reserva.observacion}</span>}
                  </div>
                  <div className="reservas-list__actions">
                    <em className={`status ${getReservaStatusClass(reserva.estado)}`}>
                      {getReservaStatusLabel(reserva.estado)}
                    </em>
                    {!String(reserva.estado).toLowerCase().includes("cancel") && (
                      <button
                        type="button"
                        className="reservas-btn reservas-btn--danger"
                        onClick={() => handleCancelReserva(reserva.id)}
                        disabled={cancelingId === reserva.id}
                      >
                        {cancelingId === reserva.id ? "Cancelando..." : "Cancelar"}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}
