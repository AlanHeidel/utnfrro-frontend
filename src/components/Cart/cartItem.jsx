import "./CartItem.css";
import { useCart } from "../../hooks/useCart.jsx";

export function CartItem({ product }) {
  const { removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  return (
    <div className="cart-item">
      <img
        src={product.thumbnail}
        alt={product.name}
        className="cart-item-image"
      />
      <div className="cart-item-details">
        <h4 className="cart-item-name">{product.name}</h4>
        <p className="cart-item-price">${product.price}</p>

        {/* Controles de cantidad */}
        <div className="cart-item-quantity-controls">
          <button
            className="quantity-btn quantity-decrease"
            onClick={() => decreaseQuantity(product)}
            title="Disminuir cantidad"
          >
            −
          </button>
          <span className="cart-item-quantity">{product.quantity}</span>
          <button
            className="quantity-btn quantity-increase"
            onClick={() => increaseQuantity(product)}
            title="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <p className="cart-item-subtotal">
          Subtotal: ${(product.price * product.quantity).toFixed(2)}
        </p>
      </div>
      <button
        className="cart-item-remove"
        onClick={() => removeFromCart(product)}
        title="Eliminar del carrito"
      >
        ✕
      </button>
    </div>
  );
}
