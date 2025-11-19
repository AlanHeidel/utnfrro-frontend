import "./NavBarList.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth.jsx";

export function NavBarList() {
  const { openLoginModal, isAuthenticated, type, logout } = useAuth();
  const navigate = useNavigate();

  const handleReserve = () => {
    if (isAuthenticated && type === "client") {
      navigate("/reservas");
      return;
    }
    openLoginModal();
  };

  return (
    <>
      <Link to="/menu" className="montserrat">
        MENU
      </Link>
      <Link to="/" className="montserrat">
        RECOMENDADOS
      </Link>
      <Link to="/" className="montserrat">
        NOSOTROS
      </Link>
      <button
        className="montserrat reserve-button"
        onClick={handleReserve}
      >
        RESERVÁ UNA MESA
      </button>
      {isAuthenticated && (
        <button
          className="montserrat reserve-button"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Salir
        </button>
      )}
    </>
  );
}
