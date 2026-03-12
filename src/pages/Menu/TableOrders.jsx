import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  getPedidosEnCocinaForTable,
  getPedidosPendientesPagoForTable,
  getPedidosRecibidosForTable,
} from "../../api/pedidos";
import {
  confirmTablePayment,
  recoverPedidoPaymentPreference,
} from "../../api/payments";
import { LoadingLogo } from "../../components/Shared/LoadingLogo/LoadingLogo";
import { useAuth } from "../../context/auth.jsx";
import "./TableOrders.css";

const MP_REDIRECT_QUERY_KEYS = [
  "collection_id",
  "collection_status",
  "payment_id",
  "status",
  "external_reference",
  "payment_type",
  "merchant_order_id",
  "preference_id",
  "site_id",
  "processing_mode",
  "merchant_account_id",
];

const orderJourney = [
  {
    key: "pending",
    title: "Pendientes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="13" rx="2" />
        <circle cx="12" cy="12.5" r="2.5" />
        <path d="M6 9.5v6M18 9.5v6" />
      </svg>
    ),
  },
  {
    key: "received",
    title: "Recibidos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v17l3-2 2 2 2-2 2 2 2-2 3 2V4a2 2 0 0 0-2-2z" />
        <line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="13" x2="14" y2="13" />
        <line x1="8" y1="17" x2="11" y2="17" />
      </svg>
    ),
  },
  {
    key: "preparing",
    title: "En cocina",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c0 0-4 4-4 9a4 4 0 0 0 8 0c0-2-1-4-1-4s-1 3-3 3c-1 0-2-1-2-2 0-2 2-6 2-6z" />
        <path d="M12 22c-3.3 0-6-2.7-6-6 0-3 1.7-5.6 3-7 0 2 1 3.5 3 4 2 .5 4-1 4-3 1.2 1.4 2 3.4 2 6 0 3.3-2.7 6-6 6z" />
      </svg>
    ),
  },
];

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
  if (
    normalized.includes("payment") ||
    normalized.includes("pago") ||
    normalized.includes("pendiente")
  ) {
    return "Pendiente";
  }
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
  const paymentData = pedido?.payment ?? pedido?.pago ?? {};
  const preferenceData = paymentData?.preference ?? {};
  const initPoint = String(
    pedido?.initPoint ??
      pedido?.init_point ??
      paymentData?.initPoint ??
      paymentData?.init_point ??
      preferenceData?.initPoint ??
      preferenceData?.init_point ??
      ""
  ).trim();

  return {
    id: pedido?.id,
    estado: pedido?.estado ?? "",
    total: Number(pedido?.total ?? 0),
    fechaHora: pedido?.fechaHora ?? null,
    mesaNumero: pedido?.mesa?.numeroMesa ?? "-",
    items: Array.isArray(pedido?.items) ? pedido.items : [],
    initPoint,
  };
}

function isPendingPaymentStatus(status) {
  const normalized = String(status ?? "").toLowerCase();
  return (
    normalized.includes("pending_payment") ||
    normalized.includes("pending-payment") ||
    normalized.includes("pendiente_pago")
  );
}

function sortByNewest(orders) {
  return [...orders].sort((a, b) => {
    const dateDiff =
      new Date(b.fechaHora ?? 0).getTime() -
      new Date(a.fechaHora ?? 0).getTime();
    if (!Number.isNaN(dateDiff) && dateDiff !== 0) return dateDiff;
    return Number(b.id ?? 0) - Number(a.id ?? 0);
  });
}

function normalizeOrdersList(rawOrders) {
  return sortByNewest((Array.isArray(rawOrders) ? rawOrders : []).map(normalizePedido));
}

export function TableOrders() {
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const lastConfirmedPaymentIdRef = useRef("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState("pending");
  const [stepCounts, setStepCounts] = useState({
    pending: 0,
    received: 0,
    preparing: 0,
  });
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [paymentLoadingOrderId, setPaymentLoadingOrderId] = useState(null);
  const [paymentErrorOrderId, setPaymentErrorOrderId] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const totalSteps = orderJourney.length;
  const activeStepIndex = orderJourney.findIndex((step) => step.key === activeStep);
  const trackEdgePercent = 100 / (totalSteps * 2);
  const trackSpanPercent = 100 - trackEdgePercent * 2;
  const fillProgress =
    activeStepIndex <= 0 ? 0 : activeStepIndex / Math.max(totalSteps - 1, 1);
  const trackFillWidth = `${fillProgress * trackSpanPercent}%`;
  const trackEdge = `${trackEdgePercent}%`;
  const emptyMessageByStep = {
    pending: "No hay pedidos pendientes de pago para tu mesa.",
    received: "No hay pedidos recibidos para tu mesa.",
    preparing: "No hay pedidos en cocina para tu mesa.",
  };

  const loadOrders = useCallback(async (stepKey) => {
    setLoading(true);
    setError("");
    try {
      const mesaId = getMesaIdFromToken(token);
      if (!mesaId) {
        setOrders([]);
        setError("No pudimos identificar la mesa de esta cuenta.");
        return;
      }

      const [pendientesPagoResult, recibidosResult, enCocinaResult] = await Promise.allSettled([
        getPedidosPendientesPagoForTable(mesaId),
        getPedidosRecibidosForTable(mesaId),
        getPedidosEnCocinaForTable(mesaId),
      ]);

      const parseResult = (result, queryKey) => {
        if (result.status === "fulfilled") {
          return { orders: normalizeOrdersList(result.value), fatal: "" };
        }

        const status = result.reason?.response?.status;
        if (status === 404) return { orders: [], fatal: "" };

        const isActiveQuery =
          (stepKey === "pending" && queryKey === "pending") ||
          (stepKey === "received" && queryKey === "received") ||
          (stepKey === "preparing" && queryKey === "preparing");

        if (!isActiveQuery) return { orders: [], fatal: "" };
        if (status === 400) return { orders: [], fatal: "El id de mesa es inválido." };
        if (status === 403) return { orders: [], fatal: "Este pedido no pertenece a tu mesa." };
        return { orders: [], fatal: "No pudimos cargar tus pedidos." };
      };

      const pendientesPagoData = parseResult(pendientesPagoResult, "pending");
      const recibidosData = parseResult(recibidosResult, "received");
      const enCocinaData = parseResult(enCocinaResult, "preparing");

      setStepCounts({
        pending: pendientesPagoData.orders.length,
        received: recibidosData.orders.length,
        preparing: enCocinaData.orders.length,
      });

      const fatalError =
        pendientesPagoData.fatal || recibidosData.fatal || enCocinaData.fatal;
      if (fatalError) {
        setOrders([]);
        setError(fatalError);
        return;
      }

      if (stepKey === "pending") {
        setOrders(pendientesPagoData.orders);
        return;
      }

      if (stepKey === "preparing") {
        setOrders(enCocinaData.orders);
        return;
      }

      if (stepKey === "received") {
        setOrders(recibidosData.orders);
        return;
      }

      setOrders([]);
    } catch (error) {
      setError("No pudimos cargar tus pedidos.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOrders(activeStep);
  }, [activeStep, loadOrders]);

  useEffect(() => {
    setPaymentLoadingOrderId(null);
    setPaymentErrorOrderId(null);
    setPaymentError("");
  }, [activeStep]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("payment_id") ?? params.get("paymentId") ?? "";
    if (!paymentId) return;

    if (lastConfirmedPaymentIdRef.current === paymentId) return;
    lastConfirmedPaymentIdRef.current = paymentId;

    const paymentStatus = String(
      params.get("status") ?? params.get("collection_status") ?? ""
    ).toLowerCase();

    const clearMpQueryParams = () => {
      const cleanParams = new URLSearchParams(location.search);
      MP_REDIRECT_QUERY_KEYS.forEach((key) => cleanParams.delete(key));
      const nextSearch = cleanParams.toString();
      navigate(
        `${location.pathname}${nextSearch ? `?${nextSearch}` : ""}`,
        { replace: true }
      );
    };

    if (paymentStatus && paymentStatus !== "approved") {
      clearMpQueryParams();
      return;
    }

    let cancelled = false;
    setConfirmingPayment(true);
    (async () => {
      try {
        await confirmTablePayment(paymentId);
        if (cancelled) return;
        await loadOrders(activeStep);
      } catch (error) {
        if (cancelled) return;
        const status = error?.response?.status;
        if (status === 403) {
          setError("No tienes permisos para confirmar este pago.");
        } else if (status === 404) {
          setError("No encontramos el pago para confirmar.");
        } else {
          setError("No pudimos confirmar el pago. Intenta actualizar.");
        }
      } finally {
        if (!cancelled) {
          setConfirmingPayment(false);
          clearMpQueryParams();
        }
      }
    })();

    return () => {
      cancelled = true;
      setConfirmingPayment(false);
    };
  }, [activeStep, loadOrders, location.pathname, location.search, navigate]);

  const handlePayOrder = async (order) => {
    if (!order || !isPendingPaymentStatus(order.estado)) return;

    setPaymentLoadingOrderId(order.id);
    setPaymentErrorOrderId(null);
    setPaymentError("");

    try {
      let initPoint = order.initPoint ?? "";

      if (!initPoint) {
        const recovered = await recoverPedidoPaymentPreference(order.id);
        initPoint = initPoint || recovered.initPoint;
      }

      if (initPoint) {
        window.location.assign(initPoint);
        return;
      }

      setPaymentErrorOrderId(order.id);
      setPaymentError("No pudimos generar el pago para este pedido.");
    } catch (error) {
      const status = error?.response?.status;
      setPaymentErrorOrderId(order.id);
      if (status === 403) {
        setPaymentError("No tienes permisos para pagar este pedido.");
      } else if (status === 404) {
        setPaymentError("No encontramos la preferencia de pago.");
      } else {
        setPaymentError("No pudimos iniciar Mercado Pago. Intenta de nuevo.");
      }
    } finally {
      setPaymentLoadingOrderId(null);
    }
  };

  const handleStepClick = (stepKey) => {
    if (stepKey === activeStep) {
      loadOrders(stepKey);
      return;
    }
    setActiveStep(stepKey);
  };

  return (
    <section className="table-orders">
      <div className="table-orders__container">
        <section
          className="table-orders__journey"
          aria-label="Flujo del pedido"
        >
          <div className="table-orders__stepper-wrapper">
            <div className="table-orders__stepper-bar">
              <Link to="/menu" className="table-orders__back">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Volver al menú
              </Link>
              <button
                type="button"
                className="table-orders__refresh"
                onClick={() => loadOrders(activeStep)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                Actualizar
              </button>
            </div>

            <div className="table-orders__stepper-track">
              <div
                className="table-orders__track-line"
                style={{ left: trackEdge, right: trackEdge }}
              />
              <div
                className="table-orders__track-line-fill"
                style={{ left: trackEdge, width: trackFillWidth }}
              />
              {orderJourney.map((step) => (
                <button
                  type="button"
                  key={step.key}
                  className={`table-orders__step table-orders__step--${
                    step.key === activeStep
                      ? "active"
                      : (stepCounts[step.key] ?? 0) > 0
                        ? "has-orders"
                        : "inactive"
                  }`}
                  onClick={() => handleStepClick(step.key)}
                >
                  <div className="table-orders__step-icon">
                    <div className="table-orders__step-counter">
                      {stepCounts[step.key] ?? 0}
                    </div>
                    {step.icon}
                  </div>
                  <div className="table-orders__step-name">{step.title}</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {loading || confirmingPayment ? (
        <div className="table-orders__empty table-orders__empty--loading">
          <LoadingLogo
            label={confirmingPayment ? "Confirmando pago..." : "Cargando pedidos..."}
          />
        </div>
      ) : error ? (
        <div className="table-orders__empty">{error}</div>
      ) : orders.length === 0 ? (
        <div className="table-orders__empty">
          <p>{emptyMessageByStep[activeStep] ?? "No hay pedidos para tu mesa."}</p>
          <Link to="/menu" className="table-orders__back">
            Ir al menú
          </Link>
        </div>
      ) : (
        <div className="table-orders__grid">
          {orders.map((order) => (
            <article key={order.id} className="table-orders__card">
              <header className="table-orders__card-head">
                <div>
                  <h2>Pedido #{order.id}</h2>
                  <p>Mesa {order.mesaNumero}</p>
                </div>
                <span
                  className={`table-orders__status ${getStatusClass(order.estado)}`}
                >
                  {getStatusLabel(order.estado)}
                </span>
              </header>

              <p className="table-orders__date">
                {formatDateTime(order.fechaHora)}
              </p>

              <ul className="table-orders__items">
                {order.items.map((item) => (
                  <li
                    key={`${order.id}-${item.id ?? `${item.plato?.id}-${item.cantidad}`}`}
                  >
                    <span>
                      {item.cantidad}x {item.plato?.nombre ?? "Plato"}
                    </span>
                    <strong>
                      $
                      {(
                        Number(item.precioUnitario ?? 0) *
                        Number(item.cantidad ?? 0)
                      ).toFixed(2)}
                    </strong>
                  </li>
                ))}
              </ul>

              <footer className="table-orders__footer">
                <span>Total</span>
                <strong>${order.total.toFixed(2)}</strong>
              </footer>

              {isPendingPaymentStatus(order.estado) && (
                <div className="table-orders__payment">
                  <button
                    type="button"
                    className="table-orders__pay-btn"
                    onClick={() => handlePayOrder(order)}
                    disabled={paymentLoadingOrderId === order.id}
                  >
                    {paymentLoadingOrderId === order.id
                      ? "Preparando pago..."
                      : "Pagar"}
                  </button>

                  {paymentErrorOrderId === order.id && paymentError ? (
                    <p className="table-orders__payment-error">{paymentError}</p>
                  ) : null}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
