import { ProductCard } from "../../components/Content/ProductCard/ProductCard.jsx";
import "./Menu.css";
import { Filters } from "./Filters.jsx";
import { products as initialProducts } from "../../Mocks/products.json";
import { useFilter } from "../../hooks/useFilter.jsx";

export function Menu() {
  const { filterProducts } = useFilter();
  const filteredProducts = filterProducts(initialProducts);

  return (
    <>
      <div className="menu">
        <Filters />
      </div>
      <div className="card-container">
        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No se encontraron productos</h3>
            <p>Intenta ajustar los filtros o buscar algo diferente</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </>
  );
}
