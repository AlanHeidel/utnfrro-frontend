import { useId } from "react";
import "./Filters.css";
import { useFilter } from "../../hooks/useFilter.jsx";

export function Filters({ categories = [] }) {
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

  const handleSearchChange = (event) => {
    setFilters((prevState) => ({
      ...prevState,
      searchTerm: event.target.value,
    }));
  };

  return (
    <section className="filters">
      <div className="filter-group price-filter">
        <label htmlFor={maxPriceFilterId}>Precio Máximo:</label>
        <div className="price-slider-container">
          <input
            type="range"
            id={maxPriceFilterId}
            min="0"
            max="50000"
            onChange={handleChangeMaxPrice}
            value={filters.maxPrice}
            className="price-slider"
          />
          <output className="price-output">${filters.maxPrice}</output>
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor="search">Buscar</label>
        <input
          type="text"
          id="search"
          placeholder="Buscar platos..."
          value={filters.searchTerm || ""}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor={categoryFilterId}>Categoría</label>
        <select
          id={categoryFilterId}
          onChange={handleChangeCategory}
          className="category-select"
          value={filters.category}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
