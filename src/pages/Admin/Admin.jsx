import { Routes, Route } from "react-router-dom";
import { Sidebar } from "../../components/Admin/SideBar/SideBar";
import { Dashboard } from "./Dashboard.jsx";
import { MenuManagement } from "./MenuManagement.jsx";
import { OrdersManagement } from "./OrdersManagement.jsx";
import { CustomersManagement } from "./CustomersManagement.jsx";
import { WaitersManagement } from "./WaitersManagement.jsx";
import "./Admin.css";

export function Admin() {
  return (
    <div className="admin-container">
      <Sidebar />
      <main className="admin-main">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="tables" element={<CustomersManagement />} />
          <Route path="waiters" element={<WaitersManagement />} />
          <Route
            path="analytics"
            element={
              <div className="coming-soon">Estadísticas - Próximamente</div>
            }
          />
          <Route
            path="settings"
            element={
              <div className="coming-soon">Configuración - Próximamente</div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
