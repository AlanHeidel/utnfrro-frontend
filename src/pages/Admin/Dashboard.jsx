import { TopBar } from "../../components/Admin/TopBar/TopBar";
import { StatsCard } from "../../components/Admin/StatsCard/StatsCard";

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

const PendingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

export function Dashboard() {
  const stats = [
    {
      title: "Pedidos Hoy",
      value: "24",
      icon: <OrdersIcon />,
      trend: "up",
      trendValue: "+12%",
      color: "blue",
    },
    {
      title: "Ingresos Hoy",
      value: "$45,230",
      icon: <RevenueIcon />,
      trend: "up",
      trendValue: "+8%",
      color: "green",
    },
    {
      title: "Mesas Ocupadas",
      value: "8/12",
      icon: <TablesIcon />,
      trend: "down",
      trendValue: "-3%",
      color: "orange",
    },
    {
      title: "Pedidos Pendientes",
      value: "5",
      icon: <PendingIcon />,
      trend: "up",
      trendValue: "+2",
      color: "red",
    },
  ];

  return (
    <div className="dashboard">
      <TopBar title="Dashboard" subtitle="Resumen general del restaurante" />

      <div className="dashboard-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Pedidos Recientes */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Pedidos Recientes</h2>
            <button className="btn-secondary">Ver todos</button>
          </div>
          <div className="orders-list">
            <div className="order-item">
              <div className="order-info">
                <span className="order-number">#001</span>
                <span className="order-table">Mesa 5</span>
              </div>
              <span className="order-status status-pending">Preparando</span>
              <span className="order-time">10 min</span>
            </div>
            <div className="order-item">
              <div className="order-info">
                <span className="order-number">#002</span>
                <span className="order-table">Mesa 3</span>
              </div>
              <span className="order-status status-ready">Listo</span>
              <span className="order-time">2 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
