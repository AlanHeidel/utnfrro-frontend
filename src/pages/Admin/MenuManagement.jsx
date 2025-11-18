import { useEffect, useMemo, useState } from "react";
import { TopBar } from "../../components/Admin/TopBar/TopBar";
import { ProductForm } from "../../components/Admin/Forms/ProductForm/ProductForm";
import {
  getPlatos,
  createPlato,
  updatePlato,
  deletePlato,
  getTipoPlatos,
} from "../../api/menu";

const statusClasses = {
  disponible: "status-available",
  agotado: "status-unavailable",
  destacado: "status-featured",
};

function capitalize(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function normalizePlato(plato) {
  const price = Number(plato.precio) || 0;
  const cost = Number(
    plato.costo ?? plato.precioCocina ?? plato.cost ?? 0
  ) || 0;
  const description = plato.descrip ?? plato.descripcion ?? "";

  const status = plato.estado ?? "Disponible";

  const rawIngredientes = plato.ingredientes;
  const ingredients = Array.isArray(rawIngredientes)
    ? rawIngredientes
    : typeof rawIngredientes === "string"
      ? JSON.parse(rawIngredientes)
      : [];
  const tipoPlatoData = plato.tipoPlato ?? {};
  const categoryId = tipoPlatoData.id?.toString() ?? "";
  const categoryName =
    typeof plato.tipoPlato === "string"
      ? plato.tipoPlato
      : tipoPlatoData.name ?? tipoPlatoData.tipo ?? "";
  const tags = ingredients.map(capitalize);
  const default_image = "https://www.sillasmesas.es/blog/wp-content/webp-express/webp-images/uploads/2020/06/Que-tipos-de-restaurantes-hay.jpg.webp"

  return {
    id: plato.id?.toString() ?? crypto.randomUUID(),
    cost,
    description,
    status,
    name: plato.nombre ?? "Sin nombre",
    categoryId,
    category: capitalize(categoryName) || "Sin categoría",
    price,
    tags,
    lastUpdated: new Date().toISOString(),
    image: plato.imagen?.trim() || default_image,
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
  const [typeOptions, setTypeOptions] = useState([]);

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

  useEffect(() => {
    let alive = true;
    const loadTipos = async () => {
      try {
        const data = await getTipoPlatos();
        if (alive) setTypeOptions(data);
      } catch (_) {
        if (alive) setTypeOptions([]);
      }
    };
    loadTipos();
    return () => { alive = false; };
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
      const estadoMap = { available: "disponible", featured: "destacado", unavailable: "agotado" }
      const payload = {
        nombre: formData.name,
        precio: Number(formData.price),
        costo: Number(formData.cost),
        descrip: formData.description,
        ingredientes: JSON.stringify(formData.tags ?? []),
        imagen: formData.image,
        estado: estadoMap[formData.status] ?? "disponible",
        tipoPlato: Number(formData.categoryId),
      };

      if (formData.id) {
        await updatePlato(formData.id, payload);
      } else {
        await createPlato(payload);
      }
      const data = await getPlatos();
      setProducts(data.map(normalizePlato));
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
            <div className="products-container">
              {filteredProducts.map((product) => {
                const margin =
                  product.price > 0
                    ? Math.round(((product.price - product.cost) / product.price) * 100)
                    : 100;

                return (
                  <article key={product.id} className="admin-product-card">
                    <img
                      className="admin-product-card__image"
                      src={product.image}
                      alt={product.name}
                    />
                    <header className="admin-product-card__header">
                      <div>
                        <h3>{product.name}</h3>
                        <p className="muted">{product.category}</p>
                      </div>
                      <span
                        className={`chip ${statusClasses[product.status] ?? ""}`}
                      >
                        {product.status ?? ""}
                      </span>
                    </header>

                    <p className="admin-product-card__description">
                      {product.description || "Sin descripción"}
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
                          {margin}%
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
                );
              })}
            </div>
          )}
        </section>

        {isFormOpen && (
          <div className="dashboard-section">
            <h2>{editingProduct ? "Editar producto" : "Nuevo producto"}</h2>
            <ProductForm
              initialValues={editingProduct}
              categoryOptions={typeOptions}
              onCancel={handleCloseForm}
              onSubmit={handleSubmitProduct}
            />
          </div>
        )}
      </div>
    </div>
  );
}
