import "./NavBarList.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth.jsx";

export function NavBarList() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleHomeSectionClick = (event, sectionId) => {
    event.preventDefault();

    if (location.pathname === "/") {
      scrollToSection(sectionId);
      return;
    }

    navigate("/", { state: { scrollTo: sectionId } });
  };

  return (
    <>
      <button
        className="montserrat menu-button"
        onClick={() => navigate("/menu")}
      >
        MENU
      </button>
      <Link
        to="/"
        className="montserrat"
        onClick={(event) => handleHomeSectionClick(event, "recomendados")}
      >
        RECOMENDADOS
      </Link>
      <Link
        to="/"
        className="montserrat"
        onClick={(event) => handleHomeSectionClick(event, "aboutus")}
      >
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
