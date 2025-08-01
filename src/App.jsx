import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home.jsx';
import { About } from './pages/About.jsx';
import { Menu } from './pages/Menu.jsx';
import { Admin } from './pages/Admin.jsx';
import { LoginCard } from './components/Header/Login/LoginCard.jsx';
import { ProtectedRoute } from './components/Routes/ProtectedRoute.jsx';
import { MainLayout } from './Layouts/MainLayout.jsx';
import { LoginPage } from './pages/LoginPage.jsx';

export function App() {
  const location = useLocation();
  const state = location.state;
  const background = state && state.background;
  const isAuthenticated = true;
  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/admin" element={<ProtectedRoute isAuthenticated={isAuthenticated}>
            <Admin />
          </ProtectedRoute>} />
        </Route>
        {!background && (
            <Route path="/login" element={<LoginPage />} />
          )}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
      {location.pathname === '/login' && <LoginCard />}
    </>
  )
}

