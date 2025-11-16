import { useEffect, useMemo, useState } from "react";
import { TopBar } from "../../components/Admin/TopBar/TopBar";
import { ProductForm } from "../../components/Admin/ProductForm/ProductForm";
import {
  getPlatos,
  createPlato,
  updatePlato,
  deletePlato,
} from "../../api/menu";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const statusLabels = {
  available: "Disponible",
  unavailable: "Agotado",
  featured: "Destacado",
};

const statusClasses = {
  available: "status-available",
  unavailable: "status-unavailable",
  featured: "status-featured",
};

function capitalize(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function normalizePlato(plato) {
  const price = Number(plato.precio) || 0;
  const ingredients = Array.isArray(plato.ingredientes)
    ? plato.ingredientes
    : [];
  const tipo =
    typeof plato.tipoPlato === "string"
      ? plato.tipoPlato
      : plato.tipoPlato?.nombre ?? plato.tipoPlato?.tipo ?? "";

  return {
    id: plato.id?.toString() ?? crypto.randomUUID(),
    name: plato.nombre ?? "Sin nombre",
    category: capitalize(tipo) || "Sin categoría",
    price,
    cost: Number(price * 0.35),
    status: "available",
    description:
      ingredients.length > 0 ? ingredients.join(", ") : "Sin descripción",
    tags: ingredients,
    lastUpdated: new Date().toISOString(),
    image: plato.imagen?.trim() ?? "",
    raw: plato,
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(value);
}

export function MenuManagement() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPlatos();
        if (isMounted) {
          setProducts(data.map(normalizePlato));
        }
      } catch (error) {
        if (isMounted) {
          setError("No pudimos cargar los platos");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(products.map((product) => product.category));
    return ["Todos", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (categoryFilter === "Todos") return true;
        return product.category === categoryFilter;
      })
      .filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [products, categoryFilter, searchTerm]);

  const openCreateForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleSubmitProduct = async (formData) => {
    try {
      const payload = {
        nombre: formData.name,
        precio: Number(formData.price),
        ingredientes: formData.tags ?? [],
        tipoPlato: formData.category,
        imagen: formData.image,
      };

      if (formData.id) {
        const updated = await updatePlato(formData.id, payload);
        setProducts((prev) =>
          prev.map((product) =>
            product.id === formData.id ? normalizePlato(updated) : product
          )
        );
      } else {
        const created = await createPlato(payload);
        setProducts((prev) => [normalizePlato(created), ...prev]);
      }

      handleCloseForm();
    } catch (error) {
      setError("No pudimos guardar el plato");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deletePlato(productId);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
    } catch (error) {
      setError("No pudimos eliminar el plato");
    }
  };

  return (
    <div className="menu-management">
      <TopBar
        title="Gestión de Menú"
        subtitle="Administra los platos, precios y disponibilidad"
      />

      <div className="menu-management__body">
        <section className="dashboard-section">
          <header className="section-header">
            <div>
              <h2>Resumen del menú</h2>
              <p className="muted">
                Controla el catálogo para mantenerlo alineado con cocina.
              </p>
            </div>
            <button className="btn-primary" onClick={openCreateForm}>
              + Nuevo producto
            </button>
          </header>

          <div className="management-toolbar">
            <input
              type="search"
              className="search-input"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <select
              className="select-input"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>

            <div className="toolbar-badge">
              {filteredProducts.length} productos visibles
            </div>
          </div>

          {isLoading ? (
            <div className="empty-state">Cargando productos del menú...</div>
          ) : error ? (
            <div className="empty-state">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              No encontramos productos con los filtros aplicados.
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <article key={product.id} className="admin-product-card">
                  <header className="admin-product-card__header">
                    <div>
                      <h3>{product.name}</h3>
                      <p className="muted">{product.category}</p>
                    </div>
                    <span
                      className={`chip ${statusClasses[product.status] ?? ""}`}
                    >
                      {statusLabels[product.status] ?? product.status}
                    </span>
                  </header>

                  <p className="admin-product-card__description">
                    {product.description}
                  </p>

                  <dl className="admin-product-card__meta">
                    <div>
                      <dt>Precio venta</dt>
                      <dd>{formatCurrency(product.price)}</dd>
                    </div>
                    <div>
                      <dt>Costo cocina</dt>
                      <dd>{formatCurrency(product.cost)}</dd>
                    </div>
                    <div>
                      <dt>Margin</dt>
                      <dd>
                        {Math.round(
                          ((product.price - product.cost) / product.price) * 100
                        )}
                        %
                      </dd>
                    </div>
                  </dl>

                  {product.tags?.length > 0 && (
                    <div className="admin-product-card__tags">
                      {product.tags.map((tag) => (
                        <span key={tag} className="product-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <footer className="admin-product-card__footer">
                    <button
                      className="btn-secondary"
                      onClick={() => openEditForm(product)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-link danger"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Eliminar
                    </button>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </section>

        {isFormOpen && (
          <div className="dashboard-section">
            <h2>{editingProduct ? "Editar producto" : "Nuevo producto"}</h2>
            <ProductForm
              initialValues={editingProduct}
              categories={categories.filter((category) => category !== "Todos")}
              onCancel={handleCloseForm}
              onSubmit={handleSubmitProduct}
            />
          </div>
        )}
      </div>
    </div>
  );
}
