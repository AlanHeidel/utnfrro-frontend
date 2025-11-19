import "./GridRecomendados.css";

const SLOT_COUNT = 6;

export function GridRecomendados({ products = [] }) {
  if (!products.length) return null;

  return (
    <div className="gallery-grid">
      {products.slice(0, SLOT_COUNT).map((product, index) => (
        <figure
          className={`gallery-item item-${(index % SLOT_COUNT) + 1}`}
          key={product.id ?? index}
        >
          <img src={product.imagen} alt={product.nombre} loading="lazy" />
          <figcaption className="gallery-caption">
            <strong>{product.nombre}</strong>
            {product.precio > 0 && (
              <span>${product.precio.toLocaleString("es-AR")}</span>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
