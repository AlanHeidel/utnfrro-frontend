import "./NavBarList.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginCard } from "../../Login/LoginCard.jsx";

export function NavBarList() {
  const [showLogin, setShowLogin] = useState(false);
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
        onClick={() => {
          setShowLogin(true);
        }}
      >
        RESERVÁ UNA MESA
      </button>
      {showLogin && <LoginCard onClose={() => setShowLogin(false)} />}
    </>
  );
}
