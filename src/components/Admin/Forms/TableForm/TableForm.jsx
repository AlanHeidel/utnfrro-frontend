import { useEffect, useState } from "react";
import "../Form.css";

const emptyProduct = {
  id: null,
  numeroMesa: "",
  capacidad: "",
  lugar: "",
  estado: "disponible",
  mozoId: "",
};

const allowedStatus = new Set(["disponible", "ocupada"]);

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
        estado: allowedStatus.has(initialValues.estado)
          ? initialValues.estado
          : "disponible",
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
    const numeroMesa =
      formValues.numeroMesa === "" ? undefined : Number(formValues.numeroMesa);
    const capacidad =
      formValues.capacidad === "" ? undefined : Number(formValues.capacidad);
    const mozoId =
      formValues.mozoId === "" ? undefined : Number(formValues.mozoId);
    onSubmit({
      ...formValues,
      numeroMesa,
      capacidad,
      estado: allowedStatus.has(formValues.estado)
        ? formValues.estado
        : "disponible",
      mozoId,
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
            <option value="" disabled>
              Seleccioná un estado
            </option>
            <option value="disponible">Disponible</option>
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
          <option value="" disabled>
            Seleccioná un mozo
          </option>
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
          {formValues.id ? "Guardar cambios" : "Crear mesa"}
        </button>
      </footer>
    </form>
  );
}
