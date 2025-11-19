import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home.jsx";
import { About } from "./pages/About.jsx";
import { Menu } from "./pages/Menu/Menu.jsx";
import { Admin } from "./pages/Admin/Admin.jsx";
import { Reservas } from "./pages/Reservas.jsx";
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
              <Route path="/about" element={<About />} />
              <Route
                path="/reservas"
                element={
                  <ProtectedRoute allowed={["client"]}>
                    <Reservas />
                  </ProtectedRoute>
                }
              />
            </Route>
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
