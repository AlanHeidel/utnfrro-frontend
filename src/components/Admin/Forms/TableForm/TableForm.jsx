import { useEffect, useState } from "react";
import "../Form.css";

const emptyProduct = {
  id: null,
  nombre: "",
  apellido: "",
};

export function TableForm({ initialValues, mozos = [], onCancel, onSubmit }) {
  const [formValues, setFormValues] = useState(emptyProduct);

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...emptyProduct,
        ...initialValues,
        numeroMesa: initialValues.numeroMesa?.toString() ?? "",
        capacidad: initialValues.capacidad?.toString() ?? "",
        lugar: initialValues.lugar?.toString() ?? "",
        estado: initialValues.estado ?? "disponible",
        mozoId: initialValues.mozoId?.toString() ?? "",
      });
    } else {
      setFormValues(emptyProduct);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const selected = mozos.find((m) => String(m.id) === String(formValues.mozoId));
    onSubmit({
      ...formValues,
      numeroMesa: Number(formValues.numeroMesa),
      capacidad: Number(formValues.capacidad),
      mozoId: formValues.mozoId ? Number(formValues.mozoId) : undefined,
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Número</span>
          <input
            type="number"
            name="numeroMesa"
            value={formValues.numeroMesa}
            onChange={handleChange}
            placeholder="Número de la mesa"
            required
          />
        </label>

        <label>
          <span>Capacidad</span>
          <input
            type="number"
            name="capacidad"
            value={formValues.capacidad}
            onChange={handleChange}
            placeholder="Capacidad de la mesa"
            required
          />
        </label>

        <label>
          <span>Ubicacion</span>
          <input
            type="string"
            name="lugar"
            value={formValues.lugar}
            onChange={handleChange}
            placeholder="Ubicacion de la mesa"
            required
          />
        </label>

        <label>
          <span>Estado</span>
          <select
            name="estado"
            value={formValues.estado}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Seleccioná un estado</option>
            <option value="disponible">Disponible</option>
            <option value="reservada">Reservada</option>
            <option value="ocupada">Ocupada</option>
          </select>
        </label>
      </div>

      <label>
        <span>Mozo</span>
        <select
          name="mozoId"
          value={formValues.mozoId}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Seleccioná un mozo</option>
          {mozos.map((mozo) => (
            <option key={mozo.id} value={mozo.id}>
              {mozo.nombre} {mozo.apellido}
            </option>
          ))}
        </select>
      </label>

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
