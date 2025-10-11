import "./MenuHeader.css";
import { useState, useEffect } from "react";
import { CartButton } from "./NavBarList/CartButton.jsx";
import { CloseButton } from "./NavBarList/CloseButton.jsx";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart.jsx";
import { CartItem } from "../Content/Cart/cartItem.jsx";

export function MenuHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, getTotal, getTotalItems, clearCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

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
        </nav>
      </header>
      {isOpen && (
        <div className="cart-overlay" onClick={() => setIsOpen(false)} />
      )}
      <div
        className={`cart-list ${isOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-list-header">
          <h2 className="menu-title montserrat">TÚ PEDIDO</h2>
          <CloseButton
            className={`close-button`}
            isOpen={isOpen}
            toggle={() => setIsOpen(!isOpen)}
          />
        </div>
        <div className="pedido-list">
          {cart.length === 0 ? (
            <p className="cart-empty">Tu carrito está vacío</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((product) => (
                  <CartItem key={product.id} product={product} />
                ))}
              </div>
              <div className="cart-footer">
                <div className="cart-total">
                  <strong>Total:</strong> ${getTotal().toFixed(2)}
                </div>
                <button className="cart-clear-btn" onClick={clearCart}>
                  Vaciar Carrito
                </button>
                <button className="cart-checkout-btn">Finalizar Pedido</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
