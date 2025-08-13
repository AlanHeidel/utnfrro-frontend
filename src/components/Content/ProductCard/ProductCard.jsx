import "./ProductCard.css";

export function ProductCard({ product }) {
  return (
    <>
      <div className="product-card">
        <div className="product-card-content">
          <img src={product.thumbnail} alt="asado image" />
          <div className="product-card-description">
            <h3 className="product-card-title">{product.name}</h3>
            <h3 className="product-card-price">${product.price}</h3>
          </div>
          <div className="product-card-hover-description">
            <p className="product-card-description">{product.description}</p>
            <button className="button-card">Anadir</button>
          </div>
        </div>
      </div>
    </>
  );
}
