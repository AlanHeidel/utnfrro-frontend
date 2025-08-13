import { useId } from "react";
import "./Filters.css";
import { useFilter } from "../../hooks/useFilter.jsx";

export function Filters() {
  const { filters, setFilters } = useFilter();

  const categoryFilterId = useId();
  const maxPriceFilterId = useId();

  const handleChangeMaxPrice = (event) => {
    setFilters((prevState) => ({
      ...prevState,
      maxPrice: event.target.value,
    }));
  };

  const handleChangeCategory = (event) => {
    setFilters((prevState) => ({
      ...prevState,
      category: event.target.value,
    }));
  };

  return (
    <section className="filters">
      <div>
        <label htmlFor={maxPriceFilterId}> Precio Maximo: </label>
        <input
          type="range"
          id={maxPriceFilterId}
          min="0"
          max="50000"
          onChange={handleChangeMaxPrice}
          value={filters.maxPrice}
        />
        <output>${filters.maxPrice}</output>
      </div>
      <div>
        <label htmlFor={categoryFilterId}>Categoria</label>
        <select id={categoryFilterId} onChange={handleChangeCategory}>
          <option value="all">Todas</option>
          <option value="entrada">Entradas</option>
          <option value="principal">Plato Principal</option>
          <option value="postre">Postres</option>
          <option value="bebida">Bebidas</option>
        </select>
      </div>
    </section>
  );
}
