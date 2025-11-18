import { useEffect, useState } from "react";
import "../Form.css";

const emptyWaiter = {
    id: null,
    nombre: "",
    apellido: "",
    dni: "",
};

export function WaiterForm({ initialValues, onCancel, onSubmit }) {
    const [formValues, setFormValues] = useState(emptyWaiter);

    useEffect(() => {
        if (initialValues) {
            setFormValues({
                ...emptyWaiter,
                ...initialValues,
                nombre: initialValues.nombre?.toString() ?? "",
                apellido: initialValues.apellido?.toString() ?? "",
                dni: initialValues.dni?.toString() ?? "",
            });
        } else {
            setFormValues(emptyWaiter);
        }
    }, [initialValues]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({
            ...formValues,
            nombre: formValues.nombre,
            apellido: formValues.apellido,
            dni: formValues.dni,
        });
    };

    return (
        <form className="product-form" onSubmit={handleSubmit}>
            <div className="form-grid">

                <label>
                    <span>Nombre</span>
                    <input
                        type="text"
                        name="nombre"
                        value={formValues.nombre}
                        onChange={handleChange}
                        placeholder="Nombre del mozo"
                        required
                    />
                </label>

                <label>
                    <span>Apellido</span>
                    <input
                        type="text"
                        name="apellido"
                        value={formValues.apellido}
                        onChange={handleChange}
                        placeholder="Apellido del mozo"
                        required
                    />
                </label>

                <label>
                    <span>DNI</span>
                    <input
                        type="text"
                        name="dni"
                        value={formValues.dni}
                        onChange={handleChange}
                        placeholder="DNI del mozo"
                        required
                    />
                </label>

            </div>
            <footer className="form-actions">
                <button type="button" className="btn-secondary" onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className="btn-primary">
                    {formValues.id ? "Guardar cambios" : "Crear mozo"}
                </button>
            </footer>
        </form>
    );
}
