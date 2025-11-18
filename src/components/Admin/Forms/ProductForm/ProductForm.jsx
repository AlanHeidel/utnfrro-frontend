import { useEffect, useMemo, useState } from "react";
import "../Form.css";

const emptyProduct = {
  id: null,
  name: "",
  categoryId: "",
  category: "",
  price: "",
  cost: "",
  status: "available",
  description: "",
  tags: [],
  image: "",
};

const statusOptions = [
  { value: "available", label: "Disponible" },
  { value: "featured", label: "Destacado" },
  { value: "unavailable", label: "Agotado" },
];

const statusMap = {
  disponible: "available",
  destacado: "featured",
  agotado: "unavailable",
};

export function ProductForm({ initialValues, categoryOptions, onCancel, onSubmit }) {
  const [formValues, setFormValues] = useState(emptyProduct);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...emptyProduct,
        ...initialValues,
        categoryId: initialValues.categoryId ?? "",
        price: initialValues.price?.toString() ?? "",
        cost: initialValues.cost?.toString() ?? "",
        tags: initialValues.tags ?? [],
        status: statusMap[initialValues.status] ?? initialValues.status ?? "available",
      });
    } else {
      setFormValues(emptyProduct);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    const nextTag = tagInput.trim();
    if (!nextTag) return;
    setFormValues((prev) => ({
      ...prev,
      tags: prev.tags.includes(nextTag)
        ? prev.tags
        : [...prev.tags, nextTag].slice(0, 8),
    }));
    setTagInput("");
  };

  const handleRemoveTag = (tag) => {
    setFormValues((prev) => ({
      ...prev,
      tags: prev.tags.filter((current) => current !== tag),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      ...formValues,
      price: parseFloat(formValues.price),
      cost: parseFloat(formValues.cost),
      tags: formValues.tags,
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Nombre</span>
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
          />
        </label>

        <label>
          <span>Categoría</span>
          <select
            name="categoryId"
            value={formValues.categoryId}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Seleccioná una categoría</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Precio de venta</span>
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            value={formValues.price}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </label>

        <label>
          <span>Costo estimado</span>
          <input
            type="number"
            name="cost"
            min="0"
            step="0.01"
            value={formValues.cost}
            onChange={handleChange}
            placeholder="0.00"
            required
          />
        </label>

        <label>
          <span>Estado</span>
          <select
            name="status"
            value={formValues.status}
            onChange={handleChange}
            required
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Imagen (URL)</span>
          <input
            type="url"
            name="image"
            value={formValues.image}
            onChange={handleChange}
            placeholder="https://..."
          />
        </label>
      </div>

      <label>
        <span>Descripción</span>
        <textarea
          name="description"
          rows={3}
          value={formValues.description}
          onChange={handleChange}
          placeholder="Breve descripción para mostrar en carta"
        />
      </label>

      <div className="tags-field">
        <div className="tags-input">
          <input
            type="text"
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            placeholder="Etiqueta (Ej: Vegano, Sin TACC)"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddTag();
              }
            }}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={handleAddTag}
          >
            Añadir
          </button>
        </div>

        <div className="tags-list">
          {formValues.tags.map((tag) => (
            <span key={tag} className="product-tag">
              {tag}
              <button
                type="button"
                className="remove-tag"
                onClick={() => handleRemoveTag(tag)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <footer className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {formValues.id ? "Guardar cambios" : "Crear producto"}
        </button>
      </footer>
    </form>
  );
}
