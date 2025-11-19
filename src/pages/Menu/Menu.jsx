import { ProductCard } from "../../components/Cart/ProductCard/ProductCard.jsx";
import "./Menu.css";
import { Filters } from "./Filters.jsx";
import { useFilter } from "../../hooks/useFilter.jsx";
import { useEffect, useState, useMemo } from "react";
import { getPlatos } from "../../api/menu";

export function Menu() {
  const { filterProducts } = useFilter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizePlato = (plato) => {
    const categoryRaw = plato.tipoPlato?.name ?? plato.tipoPlato?.tipo ?? "Sin categoría";
    const defaultImg = "https://www.sillasmesas.es/blog/wp-content/webp-express/webp-images/uploads/2020/06/Que-tipos-de-restaurantes-hay.jpg.webp";
    return {
      id: plato.id?.toString() ?? crypto.randomUUID(),
      name: plato.nombre ?? "Sin nombre",
      price: Number(plato.precio) || 0,
      description: plato.descrip ?? plato.descripcion ?? "",
      category: categoryRaw,
      thumbnail: plato.imagen?.trim() || defaultImg,
    };
  };

  const filteredProducts = useMemo(
    () => filterProducts(products),
    [filterProducts, products]
  );

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await getPlatos();
        if (alive) setProducts(data.map(normalizePlato));
      } catch (e) {
        if (alive) setError("No pudimos cargar el menú");
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category || "Sin categoría"));
    return ["Todas", ...set];
  }, [products]);

  return (
    <>
      <div className="menu">
        <Filters categories={categories} />
      </div>
      <div className="card-container">
        {loading && <div className="no-results">Cargando menú...</div>}
        {error && !loading && <div className="no-results">{error}</div>}
        {!loading && !error && (
          filteredProducts.length === 0 ? (
            <div className="no-results">
              <h3>No se encontraron productos</h3>
              <p>Intenta ajustar los filtros o buscar algo diferente</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )
        )}

      </div>
    </>
  );
}
