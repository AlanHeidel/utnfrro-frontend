import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children, isAuthenticated }) {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}