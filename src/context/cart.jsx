import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Agregar producto al carrito
  const addToCart = (product) => {
    const productInCartIndex = cart.findIndex((item) => item.id === product.id);

    if (productInCartIndex >= 0) {
      // Si el producto ya existe, aumentar cantidad
      const newCart = structuredClone(cart);
      newCart[productInCartIndex].quantity += 1;
      setCart(newCart);
    } else {
      // Si es nuevo, agregarlo con cantidad 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remover producto del carrito
  const removeFromCart = (product) => {
    setCart(cart.filter((item) => item.id !== product.id));
  };

  // Aumentar cantidad de un producto
  const increaseQuantity = (product) => {
    const newCart = cart.map((item) => {
      if (item.id === product.id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCart(newCart);
  };

  // Disminuir cantidad de un producto
  const decreaseQuantity = (product) => {
    const productInCart = cart.find((item) => item.id === product.id);

    if (productInCart.quantity === 1) {
      // Si la cantidad es 1, eliminar el producto
      removeFromCart(product);
    } else {
      // Si es mayor a 1, disminuir cantidad
      const newCart = cart.map((item) => {
        if (item.id === product.id) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      setCart(newCart);
    }
  };

  // Limpiar todo el carrito
  const clearCart = () => {
    setCart([]);
  };

  // Calcular total
  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Obtener cantidad total de items
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getTotal,
        getTotalItems,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
