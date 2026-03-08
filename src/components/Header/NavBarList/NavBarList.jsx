import "./NavBarList.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth.jsx";

export function NavBarList() {
  const { isAuthenticated, logout } = useAuth(); // ← sacamos openLoginModal
  const navigate = useNavigate();

  return (
    <>
      <button
        className="montserrat menu-button"
        onClick={() => navigate("/menu")}
      >
        MENU
      </button>
      <Link to="/" className="montserrat">
        RECOMENDADOS
      </Link>
      <Link to="/" className="montserrat">
        NOSOTROS
      </Link>
      <button
        className="montserrat reserve-button"
        onClick={() => navigate("/reservas")}
      >
        RESERVÁ UNA MESA
      </button>
      {isAuthenticated && (
        <button
          className="montserrat reserve-button"
          onClick={() => {
            logout();
            window.location.replace("/");
          }}
        >
          Salir
        </button>
      )}
    </>
  );
}
