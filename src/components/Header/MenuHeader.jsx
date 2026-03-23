import "./MenuHeader.css";
import { useState, useEffect, useId, useMemo } from "react";
import { CartButton } from "./NavBarList/CartButton.jsx";
import { CloseButton } from "./NavBarList/CloseButton.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart.jsx";
import { useToast } from "../../hooks/useToast.jsx";
import { CartItem } from "../Cart/cartItem.jsx";
import { createTablePaymentPreference } from "../../api/payments";
import { createMozoCall } from "../../api/notifications";
import { useAuth } from "../../hooks/useAuth.jsx";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL?.trim() ?? "";
const SOCKET_URL = API_URL.replace(/\/api\/?$/i, "");

export function MenuHeader() {
  const emptyCartColor = "rgba(32, 32, 32, 1)";
  const emptyCartIconId = useId().replaceAll(":", "");
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { cart, getTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCallingMozo, setIsCallingMozo] = useState(false);
  const [mozoRequested, setMozoRequested] = useState(false);

  const mesaId = useMemo(() => {
    if (!token) return null;
    try {
      const claims = jwtDecode(token);
      const id = Number(claims?.mesaId ?? null);
      return Number.isFinite(id) && id > 0 ? id : null;
    } catch {
      return null;
    }
  }, [token]);

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

  useEffect(() => {
    if (!token) return undefined;

    const socket = io(SOCKET_URL || undefined, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    const handleUpdated = (payload) => {
      const payloadMesaId = Number(payload?.mesa?.id ?? payload?.mesaId ?? null);
      if (mesaId && payloadMesaId && payloadMesaId !== mesaId) return;
      const estado = String(payload?.estado ?? "").toLowerCase();
      if (estado === "attended" || estado === "canceled") {
        setMozoRequested(false);
      } else if (estado === "pending") {
        setMozoRequested(true);
      }
    };

    socket.on("notification:updated", handleUpdated);

    return () => {
      socket.off("notification:updated", handleUpdated);
      socket.disconnect();
    };
  }, [token, mesaId]);

  const handleSubmitOrder = async () => {
    if (cart.length === 0 || isSubmitting) return;
    try {
      setIsSubmitting(true);
      const payload = {
        items: cart.map((item) => ({
          platoId: item.id,
          cantidad: item.quantity,
        })),
      };
      await createTablePaymentPreference(payload);
      clearCart();
      setIsOpen(false);
      showToast("Pedido enviado", "success");
      navigate("/menu/pedidos");
    } catch (error) {
      showToast("No pudimos enviar el pedido. Intenta de nuevo.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallMozo = async () => {
    if (mozoRequested || isCallingMozo) return;
    setIsCallingMozo(true);
    try {
      const notification = await createMozoCall();
      const estado = String(notification?.estado ?? "").toLowerCase();
      if (estado === "pending") {
        setMozoRequested(true);
      }
      showToast("Mozo solicitado correctamente", "success");
    } catch {
      showToast("No pudimos solicitar un mozo. Intenta de nuevo.", "error");
    } finally {
      setIsCallingMozo(false);
    }
  };

  return (
    <>
      <header className="menu-header">
        <nav className="menu-navbar">
          <Link to="/" className="menu-logo">
            <img src="/images/home-icon.png" alt="Logo del restaurante" />
          </Link>
          <div className="menu-actions">
            <button
              type="button"
              className={`montserrat reserve-button ${mozoRequested ? "is-disabled" : ""}`}
              onClick={handleCallMozo}
              disabled={mozoRequested || isCallingMozo}
            >
              {mozoRequested
                ? "Mozo solicitado"
                : isCallingMozo
                  ? "..."
                  : "Solicitar mozo"}
            </button>
            <Link to="/menu/pedidos" className="montserrat reserve-button">
              Ver pedidos
            </Link>
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
            <div className="cart-empty">
              <div className="cart-empty__icon" aria-hidden="true">
                <svg
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                >
                  <defs>
                    <mask id={`cart-mask-${emptyCartIconId}`}>
                      <rect x="0" y="0" width="100" height="100" fill="white" />
                      <circle cx="28" cy="38" r="16" fill="black" />
                    </mask>
                    <mask id={`x-mask-${emptyCartIconId}`}>
                      <circle cx="28" cy="38" r="14" fill="white" />
                      <line
                        x1="21"
                        y1="31"
                        x2="35"
                        y2="45"
                        stroke="black"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />
                      <line
                        x1="35"
                        y1="31"
                        x2="21"
                        y2="45"
                        stroke="black"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />
                    </mask>
                  </defs>
                  <path
                    d="M28 22 L88 22 L80 62 L36 62 Z"
                    fill={emptyCartColor}
                    mask={`url(#cart-mask-${emptyCartIconId})`}
                  />
                  <path
                    d="M14 14 L24 14 L28 22"
                    stroke={emptyCartColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <line
                    x1="36"
                    y1="62"
                    x2="80"
                    y2="62"
                    stroke={emptyCartColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <circle cx="42" cy="74" r="6" fill={emptyCartColor} />
                  <circle cx="72" cy="74" r="6" fill={emptyCartColor} />
                  <circle
                    cx="28"
                    cy="38"
                    r="14"
                    fill={emptyCartColor}
                    mask={`url(#x-mask-${emptyCartIconId})`}
                  />
                </svg>
              </div>
              <p className="cart-empty__text">
                Parece que tu carrito está vacío
              </p>
            </div>
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
                <button
                  className="cart-checkout-btn"
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting || cart.length === 0}
                >
                  {isSubmitting ? "Enviando..." : "Enviar pedido"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
