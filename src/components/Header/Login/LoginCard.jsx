import './LoginCard.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginCard() {
    const navigate = useNavigate();
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        }
    }, []);
    return (
        <div className="modal-backdrop" onClick={() => navigate(-1)}>
            <div className="login-card" onClick={(e) => e.stopPropagation()}>
                <h2>Iniciar sesión</h2>
                <input placeholder="Usuario" />
                <input type="password" placeholder="Contraseña" />
                <button>Entrar</button>
            </div>
        </div>
    );
}