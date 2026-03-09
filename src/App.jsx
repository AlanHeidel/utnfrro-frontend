import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home.jsx";
import { About } from "./pages/About.jsx";
import { Menu } from "./pages/Menu/Menu.jsx";
import { Admin } from "./pages/Admin/Admin.jsx";
import { Reservas } from "./pages/Reservas.jsx";
import { AdminLoginPage } from "./components/Login/AdminLoginPage.jsx";
import { LoginCardMesa } from "./components/Login/LoginCardMesa.jsx";
import { LoginCardReserva } from "./components/Login/LoginCardReserva.jsx";
import { ProtectedRoute } from "./components/Routes/ProtectedRoute.jsx";
import { MainLayout } from "./Layouts/MainLayout.jsx";
import { MenuLayout } from "./Layouts/MenuLayout.jsx";
import { FiltersProvider } from "./context/filters.jsx";
import { CartProvider } from "./context/cart.jsx";
import { ToastProvider } from "./context/toast.jsx";
import { AuthProvider } from "./context/auth.jsx";

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="/nosotros" element={<About />} />
              <Route path="/about" element={<Navigate to="/nosotros" replace />} />
              <Route
                path="/reservas"
                element={
                  <ProtectedRoute allowed={["cliente", "client"]}>
                    <Reservas />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="/reservas/login" element={<LoginCardReserva />} />
            <Route element={<MenuLayout />}>
              <Route
                path="/menu"
                element={
                  <ProtectedRoute allowed={["table-device"]}>
                    <FiltersProvider>
                      <Menu />
                    </FiltersProvider>
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="/menu/login" element={<LoginCardMesa />} />
            <Route path="/mesa/login" element={<Navigate to="/menu/login" replace />} />
            {/* Login de admin: página separada */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            {/* Panel admin protegido: si no hay token admin, redirige al login */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowed={["admin"]}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
