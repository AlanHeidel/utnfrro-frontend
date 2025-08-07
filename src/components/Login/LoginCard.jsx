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
        <div className="modal-backdrop" onClick={() => navigate('/')}>
            <div className="login-card" onClick={(e) => e.stopPropagation()}>
                <h1 className='title'>Iniciar sesión</h1>
                <div className='input-box'>
                    <input placeholder="Usuario" required />
                    <i className="fas fa-user"></i>
                </div>
                <div className='input-box'>
                    <input type="password" placeholder="Contraseña" required />
                    <i className="fas fa-lock"></i>
                </div>
                <button className='button-entrar'>Entrar</button>
            </div>
        </div>
    );
}