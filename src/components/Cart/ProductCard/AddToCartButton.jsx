import "./AddToCartButton.css";
import { useCart } from "../../../hooks/useCart.jsx";
import { useToast } from "../../../hooks/useToast.jsx";

export function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleClick = () => {
    addToCart(product);
    showToast(`${product.name} agregado al carrito`, "success");
  };

  return (
    <button className="add-cart-btn montserrat" onClick={handleClick}>
      <span>Agregar al carrito</span>
      <span className="add-cart-btn__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="17" cy="20" r="1.5" />
          <path d="M3 4h2l2.2 10h9.6l2-7H7.4" />
        </svg>
      </span>
    </button>
  );
}
