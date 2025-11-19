import { useEffect, useState } from "react";
import "./Recomendados.css";
import { GridRecomendados } from "../GridRecomendados/GridRecomendados.jsx";
import { getFeaturedPlatos } from "../../api/menu";

const DEFAULT_IMAGE =
  "https://www.sillasmesas.es/blog/wp-content/webp-express/webp-images/uploads/2020/06/Que-tipos-de-restaurantes-hay.jpg.webp";

function normalizePlato(plato) {
  return {
    id: plato.id?.toString() ?? crypto.randomUUID(),
    nombre: plato.nombre ?? "Plato destacado",
    precio: Number(plato.precio) || 0,
    imagen: plato.imagen?.trim() || DEFAULT_IMAGE,
  };
}

export function Recomendados() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getFeaturedPlatos(6);
        if (alive) {
          setFeatured(data.map(normalizePlato));
        }
      } catch (err) {
        if (alive) setError("No pudimos cargar los platos destacados.");
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, []);

  return (
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
      <div className="recomendados-grid">
        {loading ? (
          <p className="featured-message">Cargando platos destacados...</p>
        ) : error ? (
          <p className="featured-message">{error}</p>
        ) : featured.length === 0 ? (
          <p className="featured-message">
            No hay platos destacados disponibles por el momento.
          </p>
        ) : (
          <GridRecomendados products={featured} />
        )}
      </div>
    </section>
  );
}
