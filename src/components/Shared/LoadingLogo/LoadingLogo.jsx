import "./LoadingLogo.css";

export function LoadingLogo({ label = "Cargando..." }) {
  return (
    <div className="loading-logo" role="status" aria-live="polite">
      <div className="loading-logo__glyph" aria-hidden="true">
        <span className="loading-logo__ring loading-logo__ring--outer" />
        <span className="loading-logo__ring loading-logo__ring--inner" />
        <span className="loading-logo__core" />
      </div>
      {label ? <p className="loading-logo__label">{label}</p> : null}
    </div>
  );
}
