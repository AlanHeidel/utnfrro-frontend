import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.jsx";

export function ProtectedRoute({ children, allowed = [] }) {
    const { isAuthenticated, type, openLoginModal, setRedirectPath } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isAllowedType = allowed.length === 0 || allowed.includes(type);

    // Si no está autenticado, abre el modal y guarda la ruta objetivo
    useEffect(() => {
        if (!isAuthenticated) {
            setRedirectPath(location.pathname);
            openLoginModal();
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, location.pathname, navigate, openLoginModal, setRedirectPath]);

    // Si está autenticado pero no tiene rol permitido, reubica al home
    useEffect(() => {
        if (isAuthenticated && !isAllowedType) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, isAllowedType, navigate]);

    if (!isAuthenticated || !isAllowedType) return null;
    return children;
}
