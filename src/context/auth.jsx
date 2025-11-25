import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as apiLogin } from "../api/auth";
import { LoginCard } from "../components/Login/LoginCard.jsx";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("authToken") || "");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [redirectPath, setRedirectPath] = useState("/");
    const claims = useMemo(() => {
        if (!token || token.split(".").length < 3) return null;
        try {
            return jwtDecode(token);
        } catch {
            return null;
        }
    }, [token]);
    const kind = claims?.kind; // "account" | "table-device"
    const role = claims?.role; // "ADMIN" | "CLIENTE"
    const type = useMemo(() => {
        if (kind === "table-device") return "table-device";
        if (role) return role.toLowerCase(); // "admin" | "cliente"
        return null;
    }, [kind, role]);

    useEffect(() => {
        if (token) localStorage.setItem("authToken", token);
        else localStorage.removeItem("authToken");
    }, [token]);

    const login = async (identifier, password) => {
        const response = await apiLogin({ identifier, password });
        setToken(response.token);
        setShowLoginModal(false);
        return response;
    };

    const logout = () => {
        setToken("");
    };

    const openLoginModal = () => setShowLoginModal(true);
    const closeLoginModal = () => setShowLoginModal(false);

    const value = useMemo(
        () => ({
            token,
            kind,
            role,
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
        [token, redirectPath]
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
