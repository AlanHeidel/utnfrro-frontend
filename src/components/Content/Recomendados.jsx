import "./Recomendados.css";
import { GridRecomendados } from "../GridRecomendados/GridRecomendados.jsx";

export function Recomendados() {
  return (
    <>
      <section className="recomendados">
        <div
          className="recomendados-section-1"
          aria-hidden="true"
          role="presentation"
        >
          <h2 className="recomendados-title" aria-labelledby="aboutus-title">
            PLATOS RECOMENDADOS
          </h2>
        </div>
        <GridRecomendados />
      </section>
    </>
  );
}
