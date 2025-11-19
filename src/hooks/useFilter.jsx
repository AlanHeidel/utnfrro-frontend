import { useContext } from "react";
import { FiltersContext } from "../context/filters.jsx";

export function useFilter() {
  const { filters, setFilters } = useContext(FiltersContext);

  const filterProducts = (products) => {
    return products.filter((product) => {
      const matchesPrice = product.price <= filters.maxPrice;
      const matchesCategory =
        filters.category === "Todas" ||
        filters.category === "all" ||
        (product.category || "").toLowerCase() === filters.category.toLowerCase();
      const matchesSearch =
        !filters.searchTerm ||
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      return matchesPrice && matchesCategory && matchesSearch;
    });
  };
  return { filters, filterProducts, setFilters };
}
