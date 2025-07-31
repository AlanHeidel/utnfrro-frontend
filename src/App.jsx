import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home.jsx';
import { About } from './pages/About.jsx';
import { Menu } from './pages/Menu.jsx';
import { Login } from './pages/Login.jsx';
import { Admin } from './pages/Admin.jsx';
import { ProtectedRoute } from './components/Routes/ProtectedRoute.jsx';

export function App() {
  const isAuthenticated = true; 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={ <About /> } />
        <Route path="/menu" element={ <Menu /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/admin" element={ <ProtectedRoute isAuthenticated= {isAuthenticated}>
          <Admin />
        </ProtectedRoute> } />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

