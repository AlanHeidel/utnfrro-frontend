import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as apiLogin } from "../api/auth";
import { LoginCard } from "../components/Login/LoginCard.jsx";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("authToken") || "");
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("authUser");
        return saved ? JSON.parse(saved) : null;
    });
    const [type, setType] = useState(() => localStorage.getItem("authType") || null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [redirectPath, setRedirectPath] = useState("/");

    useEffect(() => {
        if (token) localStorage.setItem("authToken", token);
        else localStorage.removeItem("authToken");
    }, [token]);

    useEffect(() => {
        if (user) localStorage.setItem("authUser", JSON.stringify(user));
        else localStorage.removeItem("authUser");
    }, [user]);

    useEffect(() => {
        if (type) localStorage.setItem("authType", type);
        else localStorage.removeItem("authType");
    }, [type]);

    const login = async (identifier, password) => {
        const response = await apiLogin({ identifier, password });
        const resolvedType = response.type ?? (response.data?.role ? String(response.data.role).toLowerCase() : null);
        setToken(response.token);
        setUser(response.data);
        setType(resolvedType);
        setShowLoginModal(false);
        return { token: response.token, data: response.data, type: resolvedType };
    };

    const logout = () => {
        setToken("");
        setUser(null);
        setType(null);
    };

    const openLoginModal = () => setShowLoginModal(true);
    const closeLoginModal = () => setShowLoginModal(false);

    const value = useMemo(
        () => ({
            token,
            user,
            type,
            isAuthenticated: Boolean(token),
            login,
            logout,
            openLoginModal,
            closeLoginModal,
            redirectPath,
            setRedirectPath,
            clearRedirectPath: () => setRedirectPath("/"),
        }),
        [token, user, type, redirectPath]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
            {showLoginModal && <LoginCard onClose={closeLoginModal} />}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return ctx;
}
