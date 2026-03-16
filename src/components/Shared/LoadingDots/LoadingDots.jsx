import "./LoadingDots.css";

export function LoadingDots({ label = null }) {
  return (
    <div className="loading-dots" role="status" aria-live="polite">
      <div className="loading-dots__circle">
        <div className="loading-dots__dot" />
        <div className="loading-dots__outline" />
      </div>
      <div className="loading-dots__circle">
        <div className="loading-dots__dot" />
        <div className="loading-dots__outline" />
      </div>
      <div className="loading-dots__circle">
        <div className="loading-dots__dot" />
        <div className="loading-dots__outline" />
      </div>
      <div className="loading-dots__circle">
        <div className="loading-dots__dot" />
        <div className="loading-dots__outline" />
      </div>
      {label ? <p className="loading-dots__label">{label}</p> : null}
    </div>
  );
}
