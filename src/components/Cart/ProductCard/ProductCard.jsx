import "./ProductCard.css";
import { AddToCartButton } from "./AddToCartButton.jsx";
import { ViewMoreButton } from "./ViewMoreButton.jsx";

export function ProductCard({ product }) {
  return (
    <>
      <div className="card">
        <div className="product-card">
          <div className="product-card-content">
            <img src={product.thumbnail} alt="asado image" />
            <div className="add-to-cart-button">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
        <div className="product-card-description">
          <div className="title-price">
            <h3 className="montserrat product-card-title">{product.name}</h3>
            <h3 className="montserrat product-card-price">${product.price}</h3>
          </div>
          <div className="view-more-button">
            <ViewMoreButton />
          </div>
        </div>
      </div>
    </>
  );
}
