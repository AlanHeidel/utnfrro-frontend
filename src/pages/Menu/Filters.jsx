import { useId } from "react";
import { ChevronDown, Search, SlidersHorizontal, Tags } from "lucide-react";
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
        <label htmlFor={maxPriceFilterId}>
          <SlidersHorizontal size={16} />
          Precio maximo
        </label>
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

      <div className="filter-group filter-group--search">
        <label htmlFor="search">
          <Search size={16} />
          Buscar
        </label>
        <div className="filters-input-shell">
          <input
            type="text"
            id="search"
            placeholder="Buscar platos..."
            value={filters.searchTerm || ""}
            onChange={handleSearchChange}
            className="filters-search-input"
          />
        </div>
      </div>

      <div className="filter-group filter-group--category">
        <label htmlFor={categoryFilterId}>
          <Tags size={16} />
          Categoria
        </label>
        <div className="filters-select-shell">
          <select
            id={categoryFilterId}
            onChange={handleChangeCategory}
            className="filters-category-select"
            value={filters.category}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <span className="filters-select-arrow" aria-hidden="true">
            <ChevronDown size={17} />
          </span>
        </div>
      </div>
    </section>
  );
}
