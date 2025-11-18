import { useMemo, useState, useEffect } from "react";
import { TopBar } from "../../components/Admin/TopBar/TopBar";
import { WaiterForm } from "../../components/Admin/Forms/WaiterForm/WaiterForm";
import {
    getMozos,
    createMozo,
    updateMozo,
    deleteMozo,
} from "../../api/mozos";

function normalizeMozo(mozo) {
    return {
        id: mozo.id?.toString(),
        nombre: mozo.nombre,
        apellido: mozo.apellido,
        dni: mozo.dni,
    };
}

export function WaitersManagement() {
    const [mozos, setMozos] = useState([]);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

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
                nombre: formData.nombre,
                apellido: formData.apellido,
                dni: formData.dni,
            };

            if (formData.id) {
                await updateMozo(formData.id, payload);
            } else {
                await createMozo(payload);
            }
            const data = await getMozos();
            setMozos(data.map(normalizeMozo));
            handleCloseForm();
        } catch (error) {
            setError("No pudimos guardar el mozo");
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await deleteMozo(productId);
            setMozos((prev) => prev.filter((product) => product.id !== productId));
        } catch (error) {
            setError("No pudimos eliminar el mozo");
        }
    };

    useEffect(() => {
        let alive = true;
        const loadMozos = async () => {
            try {
                const data = await getMozos();
                if (alive) setMozos(data);
            } catch (_) { if (alive) setMozos([]); }
        };
        loadMozos();
        return () => { alive = false; };
    }, []);

    const filteredMozos = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return mozos;
        return mozos.filter((m) =>
            `${m.nombre} ${m.apellido} ${m.dni ?? ""}`.toLowerCase().includes(term)
        );
    }, [mozos, searchTerm]);

    return (
        <div className="tables-management">
            <TopBar
                title="Mozos y empleados"
                subtitle="Administra la cantidad de empleados"
            />

            <div className="tables-body">
                <section className="dashboard-section">
                    <div className="tables-toolbar">
                        <div className="toolbar-left">
                            <input
                                className="search-input"
                                type="search"
                                placeholder="Buscar mozo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="toolbar-right">
                            <button className="btn-primary" onClick={openCreateForm}>
                                + Nuevo Mozo
                            </button>
                        </div>
                    </div>

                    {filteredMozos.length === 0 ? (
                        <div className="empty-state">
                            No hay mozos con esas características por el momento.
                        </div>
                    ) : (
                        <div className="tables-container">
                            {filteredMozos.map((mozo) => (
                                <article key={mozo.id} className="table-card">
                                    <header className="table-card__header">
                                        <h3>{`${mozo.nombre} ${mozo.apellido}`}</h3>
                                    </header>
                                    <div className="table-card__meta">
                                        <div>
                                            <span className="metric-title">DNI</span>
                                            <strong>{mozo.dni || "Sin DNI"}</strong>
                                        </div>
                                    </div>
                                    <footer className="table-card__footer">
                                        <button
                                            className="btn-link danger"
                                            onClick={() => handleDeleteProduct(mozo.id)}
                                        >
                                            Eliminar
                                        </button>
                                        <button className="btn-primary" onClick={() => openEditForm(mozo)}>Editar</button>
                                    </footer>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {
                    isFormOpen && (
                        <div className="dashboard-section">
                            <h2>{editingProduct ? "Editar mozo" : "Nuevo mozo"}</h2>
                            <WaiterForm
                                initialValues={editingProduct}
                                mozos={mozos}
                                onCancel={handleCloseForm}
                                onSubmit={handleSubmitProduct}
                            />
                        </div>
                    )
                }

            </div >
        </div >
    );
}
