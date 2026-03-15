import { useEffect, useMemo, useState } from "react";
import { TopBar } from "../../components/Admin/TopBar/TopBar";
import { StatsCard } from "../../components/Admin/StatsCard/StatsCard";
import { AdminModal } from "../../components/Admin/Modal/AdminModal";
import {
  getCuentasUsuariosMetric,
  getDashboardMensual,
  getDashboardObjetivos,
  getIngresosHoyMetric,
  getMesasOcupadasMetric,
  getPedidosHoyMetric,
  getTopProductosDashboard,
  updateDashboardObjetivos,
} from "../../api/admin";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Iconos SVG para las stats
const OrdersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const RevenueIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);

const TablesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M7 8V6a2 2 0 012-2h6a2 2 0 012 2v2" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="3.5" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M14 3.13a3.5 3.5 0 0 1 0 6.74" />
  </svg>
);

const PIE_COLORS = {
  pending_payment: "#d6a98c",
  pending: "#ffb88e",
  in_progress: "#f38a53",
  delivered: "#e76834",
  canceled: "#701c1cff",
};

const STATUS_LABELS = {
  pending_payment: "Pendientes de pago",
  pending: "Recibidos",
  in_progress: "En cocina",
  delivered: "Entregados",
  canceled: "Cancelados",
};

const DEFAULT_PRODUCT_IMAGE = "/images/default-image.webp";

function getCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

function formatNumber(value) {
  return new Intl.NumberFormat("es-AR").format(Number(value ?? 0));
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Number(value ?? 0)));
}

function normalizeMonthlyData(data, monthFallback) {
  return {
    month: data?.month ?? monthFallback,
    graficas: {
      evolucionIngresos: Array.isArray(data?.graficas?.evolucionIngresos)
        ? data.graficas.evolucionIngresos
        : [],
      distribucionEstados: Array.isArray(data?.graficas?.distribucionEstados)
        ? data.graficas.distribucionEstados
        : [],
    },
    objetivos: {
      ventas: data?.objetivos?.ventas ?? {
        actual: 0,
        objetivo: 0,
        porcentajeCumplido: 0,
        faltante: 0,
      },
      pedidos: data?.objetivos?.pedidos ?? {
        actual: 0,
        objetivo: 0,
        porcentajeCumplido: 0,
        faltante: 0,
      },
      cancelaciones: data?.objetivos?.cancelaciones ?? {
        actual: 0,
        maximoTolerado: 0,
        porcentajeUsoLimite: 0,
        restanteHastaLimite: 0,
        limiteSuperado: false,
      },
    },
  };
}

function PieStatusTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="analytics-tooltip">
      <p>{`${point.estadoLabel}: ${formatNumber(point.cantidad)}`}</p>
    </div>
  );
}

export function Dashboard() {
  const [metrics, setMetrics] = useState({
    pedidosHoy: 0,
    ingresosHoy: 0,
    mesasOcupadas: 0,
    totalMesas: 0,
    cuentasUsuarios: 0,
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [metricsError, setMetricsError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [monthlyData, setMonthlyData] = useState({
    month: getCurrentMonth(),
    graficas: {
      evolucionIngresos: [],
      distribucionEstados: [],
    },
    objetivos: {
      ventas: { actual: 0, objetivo: 0, porcentajeCumplido: 0, faltante: 0 },
      pedidos: { actual: 0, objetivo: 0, porcentajeCumplido: 0, faltante: 0 },
      cancelaciones: {
        actual: 0,
        maximoTolerado: 0,
        porcentajeUsoLimite: 0,
        restanteHastaLimite: 0,
        limiteSuperado: false,
      },
    },
  });
  const [loadingMonthly, setLoadingMonthly] = useState(true);
  const [monthlyError, setMonthlyError] = useState("");
  const [topProducts, setTopProducts] = useState([]);
  const [loadingTopProducts, setLoadingTopProducts] = useState(true);
  const [topProductsError, setTopProductsError] = useState("");
  const [topProductsMonth, setTopProductsMonth] = useState(getCurrentMonth());
  const [goalsModalOpen, setGoalsModalOpen] = useState(false);
  const [loadingGoalsForm, setLoadingGoalsForm] = useState(false);
  const [savingGoals, setSavingGoals] = useState(false);
  const [goalsFormError, setGoalsFormError] = useState("");
  const [goalsForm, setGoalsForm] = useState({
    salesTarget: "",
    ordersTarget: "",
    maxCanceledTarget: "",
  });

  useEffect(() => {
    let alive = true;
    const loadMetrics = async () => {
      try {
        setLoadingMetrics(true);
        setMetricsError("");

        const [pedidosHoy, ingresosHoy, mesasEstado, cuentasUsuarios] =
          await Promise.all([
            getPedidosHoyMetric(),
            getIngresosHoyMetric(),
            getMesasOcupadasMetric(),
            getCuentasUsuariosMetric(),
          ]);

        if (!alive) return;
        setMetrics({
          pedidosHoy: Number(pedidosHoy?.cantidad ?? 0),
          ingresosHoy: Number(ingresosHoy?.total ?? 0),
          mesasOcupadas: Number(mesasEstado?.mesasOcupadas ?? 0),
          totalMesas: Number(mesasEstado?.totalMesas ?? 0),
          cuentasUsuarios: Number(cuentasUsuarios?.cuentasUsuarios ?? 0),
        });
      } catch (_) {
        if (alive)
          setMetricsError("No pudimos cargar las métricas del dashboard.");
      } finally {
        if (alive) setLoadingMetrics(false);
      }
    };

    loadMetrics();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const loadMonthlyDashboard = async () => {
      try {
        setLoadingMonthly(true);
        setMonthlyError("");
        const data = await getDashboardMensual(selectedMonth);
        if (!alive) return;
        setMonthlyData(normalizeMonthlyData(data, selectedMonth));
      } catch (_) {
        if (alive) {
          setMonthlyError("No pudimos cargar las gráficas mensuales.");
        }
      } finally {
        if (alive) setLoadingMonthly(false);
      }
    };

    loadMonthlyDashboard();
    return () => {
      alive = false;
    };
  }, [selectedMonth]);

  useEffect(() => {
    let alive = true;
    const loadTopProducts = async () => {
      try {
        setLoadingTopProducts(true);
        setTopProductsError("");

        const response = await getTopProductosDashboard(selectedMonth, 4);
        if (!alive) return;

        setTopProductsMonth(response?.month ?? selectedMonth);
        setTopProducts(
          (Array.isArray(response?.data) ? response.data : []).map(
            (product, index) => ({
              id: `plato-${product?.platoId ?? index}`,
              titulo: product?.titulo ?? "Sin título",
              imagen: product?.imagen ?? "",
              tipoPlato: product?.tipoPlato ?? "Sin categoría",
              precioVenta: Number(product?.precioVenta ?? 0),
              unidadesVendidas: Number(product?.unidadesVendidas ?? 0),
              ingresoGenerado: Number(product?.ingresoGenerado ?? 0),
            }),
          ),
        );
      } catch (_) {
        if (alive)
          setTopProductsError("No pudimos cargar los productos más vendidos.");
      } finally {
        if (alive) setLoadingTopProducts(false);
      }
    };

    loadTopProducts();
    return () => {
      alive = false;
    };
  }, [selectedMonth]);

  const formattedIngresos = useMemo(
    () => formatCurrency(metrics.ingresosHoy),
    [metrics.ingresosHoy],
  );

  const areaData = useMemo(
    () =>
      (monthlyData?.graficas?.evolucionIngresos ?? []).map((point) => ({
        day: Number(point.day ?? 0),
        ingresos: Number(point.ingresos ?? 0),
        fecha: point.fecha ?? "",
      })),
    [monthlyData],
  );

  const pieData = useMemo(
    () =>
      (monthlyData?.graficas?.distribucionEstados ?? []).map((entry) => ({
        estado: entry.estado ?? "unknown",
        estadoLabel:
          STATUS_LABELS[entry.estado] ?? entry.estado ?? "Sin estado",
        cantidad: Number(entry.cantidad ?? 0),
        color: PIE_COLORS[entry.estado] ?? "#b87657",
      })),
    [monthlyData],
  );

  const hasPieData = useMemo(
    () => pieData.some((entry) => entry.cantidad > 0),
    [pieData],
  );

  const refreshMonthlyDashboard = async (month) => {
    try {
      setLoadingMonthly(true);
      setMonthlyError("");
      const data = await getDashboardMensual(month);
      setMonthlyData(normalizeMonthlyData(data, month));
    } catch (_) {
      setMonthlyError("No pudimos cargar las gráficas mensuales.");
    } finally {
      setLoadingMonthly(false);
    }
  };

  const handleOpenGoalsModal = async () => {
    const fallbackSales = Number(monthlyData?.objetivos?.ventas?.objetivo ?? 0);
    const fallbackOrders = Number(monthlyData?.objetivos?.pedidos?.objetivo ?? 0);
    const fallbackCanceled = Number(
      monthlyData?.objetivos?.cancelaciones?.maximoTolerado ?? 0,
    );

    setGoalsForm({
      salesTarget: String(fallbackSales),
      ordersTarget: String(fallbackOrders),
      maxCanceledTarget: String(fallbackCanceled),
    });
    setGoalsFormError("");
    setGoalsModalOpen(true);
    setLoadingGoalsForm(true);

    try {
      const data = await getDashboardObjetivos(selectedMonth);
      setGoalsForm({
        salesTarget: String(Number(data?.salesTarget ?? fallbackSales)),
        ordersTarget: String(Number(data?.ordersTarget ?? fallbackOrders)),
        maxCanceledTarget: String(
          Number(data?.maxCanceledTarget ?? fallbackCanceled),
        ),
      });
    } catch (_) {
      setGoalsFormError("No pudimos cargar los objetivos guardados.");
    } finally {
      setLoadingGoalsForm(false);
    }
  };

  const handleGoalsInputChange = (field) => (event) => {
    setGoalsForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSaveGoals = async (event) => {
    event.preventDefault();
    setGoalsFormError("");

    const salesTarget = Number(goalsForm.salesTarget);
    const ordersTarget = Number(goalsForm.ordersTarget);
    const maxCanceledTarget = Number(goalsForm.maxCanceledTarget);

    if (
      Number.isNaN(salesTarget) ||
      Number.isNaN(ordersTarget) ||
      Number.isNaN(maxCanceledTarget)
    ) {
      setGoalsFormError("Todos los objetivos deben ser números válidos.");
      return;
    }

    if (salesTarget < 0 || ordersTarget < 0 || maxCanceledTarget < 0) {
      setGoalsFormError("Los objetivos no pueden ser negativos.");
      return;
    }

    try {
      setSavingGoals(true);
      await updateDashboardObjetivos(
        {
          salesTarget,
          ordersTarget,
          maxCanceledTarget,
        },
        selectedMonth,
      );
      await refreshMonthlyDashboard(selectedMonth);
      setGoalsModalOpen(false);
    } catch (_) {
      setGoalsFormError("No pudimos guardar los objetivos.");
    } finally {
      setSavingGoals(false);
    }
  };

  const goals = useMemo(() => {
    const ventas = monthlyData?.objetivos?.ventas ?? {};
    const pedidos = monthlyData?.objetivos?.pedidos ?? {};
    const cancelaciones = monthlyData?.objetivos?.cancelaciones ?? {};
    const ventasActual = Number(ventas.actual ?? 0);
    const ventasObjetivo = Number(ventas.objetivo ?? 0);
    const ventasCumplido =
      ventasObjetivo <= 0 ? ventasActual > 0 : ventasActual >= ventasObjetivo;
    const ventasProgressRaw = Number(ventas.porcentajeCumplido ?? 0);

    const pedidosActual = Number(pedidos.actual ?? 0);
    const pedidosObjetivo = Number(pedidos.objetivo ?? 0);
    const pedidosCumplido =
      pedidosObjetivo <= 0
        ? pedidosActual > 0
        : pedidosActual >= pedidosObjetivo;
    const pedidosProgressRaw = Number(pedidos.porcentajeCumplido ?? 0);
    const cancelActual = Number(cancelaciones.actual ?? 0);
    const cancelMaximo = Number(cancelaciones.maximoTolerado ?? 0);
    const cancelSuperadoFromBack =
      typeof cancelaciones.limiteSuperado === "boolean"
        ? cancelaciones.limiteSuperado
        : null;
    const cancelSuperadoCalculated =
      cancelMaximo <= 0 ? cancelActual > 0 : cancelActual > cancelMaximo;
    const cancelLimiteSuperado =
      cancelSuperadoFromBack === null
        ? cancelSuperadoCalculated
        : cancelSuperadoFromBack || cancelSuperadoCalculated;
    const cancelProgressRaw =
      cancelMaximo <= 0
        ? cancelActual > 0
          ? 100
          : 0
        : Number(cancelaciones.porcentajeUsoLimite ?? 0);

    return [
      {
        id: "ventas",
        title: "Objetivo ventas",
        actualText: formatCurrency(ventas.actual),
        targetText: formatCurrency(ventas.objetivo),
        progress: clampPercent(
          ventasObjetivo <= 0 ? (ventasActual > 0 ? 100 : 0) : ventasProgressRaw,
        ),
        progressText: `${(ventasObjetivo <= 0
          ? ventasActual > 0
            ? 100
            : 0
          : ventasProgressRaw
        ).toFixed(1)}%`,
        helperText: `Faltante: ${formatCurrency(ventas.faltante)}`,
        kind: "positive",
        achieved: ventasCumplido,
      },
      {
        id: "pedidos",
        title: "Objetivo pedidos",
        actualText: formatNumber(pedidos.actual),
        targetText: formatNumber(pedidos.objetivo),
        progress: clampPercent(
          pedidosObjetivo <= 0
            ? pedidosActual > 0
              ? 100
              : 0
            : pedidosProgressRaw,
        ),
        progressText: `${(pedidosObjetivo <= 0
          ? pedidosActual > 0
            ? 100
            : 0
          : pedidosProgressRaw
        ).toFixed(1)}%`,
        helperText: `Faltante: ${formatNumber(pedidos.faltante)}`,
        kind: "positive",
        achieved: pedidosCumplido,
      },
      {
        id: "cancelaciones",
        title: "Límite cancelaciones",
        actualText: formatNumber(cancelActual),
        targetText: formatNumber(cancelMaximo),
        progress: clampPercent(cancelProgressRaw),
        progressText: `${Number(cancelProgressRaw).toFixed(1)}%`,
        helperText: cancelLimiteSuperado
          ? `Límite superado`
          : `Restante: ${formatNumber(cancelaciones.restanteHastaLimite)}`,
        kind: cancelLimiteSuperado ? "warning" : "neutral",
        statusTone: cancelLimiteSuperado ? "alert" : "ok",
        achieved: false,
      },
    ];
  }, [monthlyData]);

  const stats = [
    {
      title: "Pedidos Hoy",
      value: loadingMetrics ? "..." : metrics.pedidosHoy.toString(),
      icon: <OrdersIcon />,
      color: "subtle",
    },
    {
      title: "Ingresos Hoy",
      value: loadingMetrics ? "..." : formattedIngresos,
      icon: <RevenueIcon />,
      color: "subtle",
    },
    {
      title: "Mesas Ocupadas",
      value: loadingMetrics
        ? "..."
        : `${metrics.mesasOcupadas}/${metrics.totalMesas}`,
      icon: <TablesIcon />,
      color: "subtle",
    },
    {
      title: "Cuentas Usuarios",
      value: loadingMetrics ? "..." : metrics.cuentasUsuarios.toString(),
      icon: <UsersIcon />,
      color: "subtle",
    },
  ];

  return (
    <div className="dashboard">
      <TopBar title="Dashboard" subtitle="Resumen general del restaurante" />

      <div className="dashboard-content">
        {metricsError ? (
          <div className="empty-state">{metricsError}</div>
        ) : null}

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <section className="dashboard-analytics">
          <article className="analytics-card analytics-card--area">
            <header className="analytics-card__header">
              <div>
                <h3>Evolución de ingresos</h3>
                <p>Seguimiento diario del mes seleccionado</p>
              </div>
              <label className="analytics-card__month">
                <span>Mes</span>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                />
              </label>
            </header>
            <div className="analytics-card__body">
              {loadingMonthly ? (
                <div className="analytics-card__empty">Cargando gráfica...</div>
              ) : monthlyError ? (
                <div className="analytics-card__empty">{monthlyError}</div>
              ) : areaData.length === 0 ? (
                <div className="analytics-card__empty">
                  Sin datos para mostrar.
                </div>
              ) : (
                <div className="analytics-chart analytics-chart--area">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={areaData}
                      margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="areaIngresos"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#ff6b35"
                            stopOpacity={0.32}
                          />
                          <stop
                            offset="100%"
                            stopColor="#ff6b35"
                            stopOpacity={0.03}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1e9e3" />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: "#8c796d", fontSize: 12 }}
                        axisLine={{ stroke: "#eadfd7" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#8c796d", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) =>
                          new Intl.NumberFormat("es-AR", {
                            notation: "compact",
                            maximumFractionDigits: 1,
                          }).format(value)
                        }
                      />
                      <Tooltip
                        isAnimationActive={true}
                        formatter={(value) => [
                          formatCurrency(value),
                          "Ingresos",
                        ]}
                        labelFormatter={(label) => `Día ${label}`}
                        contentStyle={{
                          border: "1px solid #f0e3da",
                          borderRadius: "10px",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="ingresos"
                        stroke="#e76834"
                        strokeWidth={2.2}
                        fill="url(#areaIngresos)"
                        activeDot={{ r: 5 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </article>

          <article className="analytics-card analytics-card--pie">
            <header className="analytics-card__header">
              <div>
                <h3>Distribución de estados</h3>
                <p>Pedidos del mes por estado</p>
              </div>
            </header>
            <div className="analytics-card__body">
              {loadingMonthly ? (
                <div className="analytics-card__empty">Cargando gráfica...</div>
              ) : monthlyError ? (
                <div className="analytics-card__empty">{monthlyError}</div>
              ) : !hasPieData ? (
                <div className="analytics-card__empty">
                  Sin datos para mostrar.
                </div>
              ) : (
                <>
                  <div className="analytics-chart analytics-chart--pie">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip
                          content={<PieStatusTooltip />}
                          isAnimationActive={true}
                          animationDuration={300}
                          animationEasing="ease-out"
                          offset={10}
                        />
                        <Pie
                          data={pieData}
                          dataKey="cantidad"
                          nameKey="estadoLabel"
                          innerRadius={52}
                          outerRadius={88}
                          paddingAngle={2}
                        >
                          {pieData.map((entry) => (
                            <Cell key={entry.estado} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="analytics-legend">
                    {pieData.map((entry) => (
                      <li key={entry.estado}>
                        <span
                          className="analytics-legend__dot"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="analytics-legend__label">
                          {entry.estadoLabel}
                        </span>
                        <strong>{formatNumber(entry.cantidad)}</strong>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </article>
        </section>

        <section className="dashboard-bottom-panels">
          <section className="goals-card">
            <header className="goals-card__header">
              <div>
                <h3>Objetivos mensuales</h3>
                <p>Cumplimiento del mes {monthlyData?.month ?? selectedMonth}</p>
              </div>
              <button
                type="button"
                className="goals-card__edit-btn"
                onClick={handleOpenGoalsModal}
              >
                Editar objetivos
              </button>
            </header>

            {loadingMonthly ? (
              <div className="analytics-card__empty">Cargando objetivos...</div>
            ) : monthlyError ? (
              <div className="analytics-card__empty">{monthlyError}</div>
            ) : (
              <div className="goals-stack">
                {goals.map((goal) => (
                  <article
                    key={goal.id}
                    className={`goal-item ${goal.achieved ? "goal-item--achieved" : ""} ${goal.statusTone ? `goal-item--${goal.statusTone}` : ""}`}
                  >
                    <div className="goal-item__top">
                      <h4>{goal.title}</h4>
                      <span>{goal.progressText}</span>
                    </div>
                    <div className="goal-item__values">
                      <strong>{goal.actualText}</strong>
                      <span>de {goal.targetText}</span>
                    </div>
                    <div className="goal-item__track">
                      <div
                        className={`goal-item__fill goal-item__fill--${goal.kind}`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <p className="goal-item__helper">{goal.helperText}</p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="top-products-card">
            <header className="goals-card__header">
              <h3>Productos más vendidos</h3>
              <p>Top 4 del mes {topProductsMonth ?? selectedMonth}</p>
            </header>

            {loadingTopProducts ? (
              <div className="analytics-card__empty">Cargando productos...</div>
            ) : topProductsError ? (
              <div className="analytics-card__empty">{topProductsError}</div>
            ) : topProducts.length === 0 ? (
              <div className="analytics-card__empty">
                Sin productos para mostrar en este mes.
              </div>
            ) : (
              <ul className="top-products-list">
                {topProducts.map((product, index) => (
                  <li key={product.id} className="top-product-item">
                    <span className="top-product-item__rank">#{index + 1}</span>

                    <img
                      className="top-product-item__image"
                      src={product.imagen || DEFAULT_PRODUCT_IMAGE}
                      alt={product.titulo}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                      }}
                    />

                    <div className="top-product-item__info">
                      <h4>{product.titulo}</h4>
                      <p>
                        {product.tipoPlato} • {formatCurrency(product.precioVenta)}
                      </p>
                    </div>
                    <div className="top-product-item__stats">
                      <strong>{formatCurrency(product.ingresoGenerado)}</strong>
                      <span>
                        {formatNumber(product.unidadesVendidas)} vendidos
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>

        {goalsModalOpen ? (
          <AdminModal
            title={`Editar objetivos (${selectedMonth})`}
            onClose={() => {
              if (savingGoals) return;
              setGoalsModalOpen(false);
              setGoalsFormError("");
            }}
          >
            <form className="goals-form" onSubmit={handleSaveGoals}>
              {loadingGoalsForm ? (
                <div className="analytics-card__empty">Cargando objetivos...</div>
              ) : (
                <>
                  <label className="goals-form__field">
                    <span>Objetivo de ventas (ARS)</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={goalsForm.salesTarget}
                      onChange={handleGoalsInputChange("salesTarget")}
                      required
                    />
                  </label>

                  <label className="goals-form__field">
                    <span>Objetivo de pedidos</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={goalsForm.ordersTarget}
                      onChange={handleGoalsInputChange("ordersTarget")}
                      required
                    />
                  </label>

                  <label className="goals-form__field">
                    <span>Máximo cancelados</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={goalsForm.maxCanceledTarget}
                      onChange={handleGoalsInputChange("maxCanceledTarget")}
                      required
                    />
                  </label>

                  {goalsFormError ? (
                    <p className="goals-form__error">{goalsFormError}</p>
                  ) : null}

                  <div className="goals-form__actions">
                    <button
                      type="button"
                      className="goals-form__btn goals-form__btn--ghost"
                      onClick={() => {
                        if (savingGoals) return;
                        setGoalsModalOpen(false);
                        setGoalsFormError("");
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="goals-form__btn goals-form__btn--primary"
                      disabled={savingGoals}
                    >
                      {savingGoals ? "Guardando..." : "Guardar objetivos"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </AdminModal>
        ) : null}
      </div>
    </div>
  );
}
