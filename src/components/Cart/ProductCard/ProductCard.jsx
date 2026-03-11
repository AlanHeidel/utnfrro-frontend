import "./ProductCard.css";
import { AddToCartButton } from "./AddToCartButton.jsx";

export function ProductCard({ product }) {
  return (
    <article className="menu-product-card">
      <div className="menu-product-card__media">
        <img src={product.thumbnail} alt={product.name} />
      </div>

      <div className="menu-product-card__body">
        <header className="menu-product-card__header">
          <h3 className="montserrat menu-product-card__title">{product.name}</h3>
          <p className="montserrat menu-product-card__price">${product.price}</p>
        </header>

        <p className="menu-product-card__description">
          {product.description?.trim() || "Sin descripcion disponible para este plato."}
        </p>

        <div className="menu-product-card__actions">
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
