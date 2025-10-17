import "./StatsCard.css";

export function StatsCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = "blue",
}) {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-header">
        <div className="stats-info">
          <p className="stats-title">{title}</p>
          <h3 className="stats-value">{value}</h3>
        </div>
        <div className="stats-icon">{icon}</div>
      </div>
      {trend && (
        <div className="stats-footer">
          <span
            className={`stats-trend ${
              trend === "up" ? "trend-up" : "trend-down"
            }`}
          >
            {trend === "up" ? "↑" : "↓"} {trendValue}
          </span>
          <span className="stats-period">vs. mes anterior</span>
        </div>
      )}
    </div>
  );
}
