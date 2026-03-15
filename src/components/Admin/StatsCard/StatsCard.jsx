import "./StatsCard.css";

export function StatsCard({
  title,
  value,
  icon,
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
    </div>
  );
}
