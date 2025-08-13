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
      <div className="menu-header">
        <Filters />
      </div>
      <div className="card-container">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
