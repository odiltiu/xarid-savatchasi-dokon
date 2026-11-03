import { createContext, useContext, useEffect, useReducer } from "react";

const CartContext = createContext();

const CART_KEY = "xarid_savatchasi";

// 1. Boshlang'ich holat: savat sahifa yangilanganda ham saqlanib qoladi
const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter((i) => i && i.id !== undefined && i.quantity > 0) : [];
  } catch {
    return [];
  }
};

// Ombordagi sondan ko'p qo'shib bo'lmaydi (stock bo'lmasa — cheklov yo'q)
// eslint-disable-next-line react-refresh/only-export-components
export const maxQuantity = (item) => (Number.isFinite(item?.stock) ? item.stock : Infinity);

// 2. Cart Reducer funksiyasi
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const product = action.payload;
      const existingProduct = state.find((item) => item.id === product.id);

      if (existingProduct) {
        return state.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, maxQuantity(item)) }
            : item
        );
      }
      if (maxQuantity(product) < 1) return state;
      return [
        ...state,
        {
          ...product,
          image: product.thumbnail || product.image,
          quantity: 1,
        },
      ];
    }

    case "REMOVE_FROM_CART": {
      const productId = action.payload;
      return state.filter((item) => item.id !== productId);
    }

    case "INCREASE_QUANTITY": {
      const productId = action.payload;
      return state.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.min(item.quantity + 1, maxQuantity(item)) }
          : item
      );
    }

    case "DECREASE_QUANTITY": {
      const productId = action.payload;
      return state
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
    }

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

// 3. Cart Provider komponenti
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // xotira yopiq bo'lsa ham savat ishlayveradi
    }
  }, [cart]);

  // Dispatch yordamida action funksiyalar:
  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  };

  const increaseQuantity = (productId) => {
    dispatch({ type: "INCREASE_QUANTITY", payload: productId });
  };

  const decreaseQuantity = (productId) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  // Umumiy summa (totalPrice) hisoblash
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Umumiy dona soni (totalItems) hisoblash
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        dispatch,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 4. Custom Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  return useContext(CartContext);
};

