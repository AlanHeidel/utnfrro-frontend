import "./MenuHeader.css";
import { useState } from "react";
import { CartButton } from "./NavBarList/CartButton.jsx";
import { CloseButton } from "./NavBarList/CloseButton.jsx";
import { Link } from "react-router-dom";

export function MenuHeader() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <header className="menu-header">
        <nav className="menu-navbar">
          <Link to="/" className="menu-logo">
            <img src="/images/home-icon.png" alt="Logo del restaurante" />
          </Link>
          <div>
            <CartButton isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
          </div>
          <div className={`cart-list ${isOpen ? "open" : ""}`}>
            <div className="cart-list-header">
              <h2 className="menu-title montserrat">TÚ PEDIDO</h2>
              <CloseButton
                className={`close-button`}
                isOpen={isOpen}
                toggle={() => setIsOpen(!isOpen)}
              />
            </div>
            <div className="pedido-list">LISTADO DE PRODUCTOS PEDIDOS</div>
          </div>
        </nav>
      </header>
    </>
  );
}
