import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home.jsx";
import { About } from "./pages/About.jsx";
import { Menu } from "./pages/Menu/Menu.jsx";
import { Admin } from "./pages/Admin.jsx";
import { ProtectedRoute } from "./components/Routes/ProtectedRoute.jsx";
import { MainLayout } from "./Layouts/MainLayout.jsx";
import { MenuLayout } from "./Layouts/MenuLayout.jsx";
import { FiltersProvider } from "./context/filters.jsx";
import { CartProvider } from "./context/cart.jsx";
import { ToastProvider } from "./context/toast.jsx";

export function App() {
  const location = useLocation();
  const state = location.state;
  const background = state && state.background;
  const isAuthenticated = true;
  return (
    <ToastProvider>
      <CartProvider>
        <Routes location={background || location}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route element={<MenuLayout />}>
            <Route
              path="/menu"
              element={
                <FiltersProvider>
                  <Menu />
                </FiltersProvider>
              }
            />
          </Route>
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </CartProvider>
    </ToastProvider>
  );
}
