import { Routes, Route } from "react-router-dom";
import { Sidebar } from "../../components/Admin/SideBar/SideBar";
import { Dashboard } from "./Dashboard.jsx";
import { MenuManagement } from "./MenuManagement.jsx";
import { OrdersManagement } from "./OrdersManagement.jsx";
import { CustomersManagement } from "./CustomersManagement.jsx";
import { WaitersManagement } from "./WaitersManagement.jsx";
import { ReservationsManagement } from "./ReservationsManagement.jsx";
import { NotificationsManagement } from "./NotificationsManagement.jsx";
import { AdminNotificationsProvider } from "../../context/adminNotifications.jsx";
import "./Admin.css";

export function Admin() {
  return (
    <AdminNotificationsProvider>
      <div className="admin-container">
        <Sidebar />
        <main className="admin-main">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="reservas" element={<ReservationsManagement />} />
            <Route path="tables" element={<CustomersManagement />} />
            <Route path="waiters" element={<WaitersManagement />} />
            <Route
              path="notificaciones"
              element={<NotificationsManagement />}
            />
          </Routes>
        </main>
      </div>
    </AdminNotificationsProvider>
  );
}
