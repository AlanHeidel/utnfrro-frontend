import './NavBarList.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export function NavBarList() {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <>
            <Link to="/menu" className="montserrat">MENU</Link>
            <Link to="/" className="montserrat">RECOMENDADOS</Link>
            <Link to="/" className="montserrat">NOSOTROS</Link>
            <button
                className="montserrat reserve-button"
                onClick={() => {
                    navigate('/login', { state: { background: location } })
                }}
            >
                RESERVÁ UNA MESA
            </button>
        </>
    )
}
