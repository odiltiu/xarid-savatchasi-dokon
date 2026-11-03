import { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

// 1. Initial State (boshlang'ich holat)
const initialCartState = [];

// 2. Cart Reducer funksiyasi
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const product = action.payload;
      const existingProduct = state.find((item) => item.id === product.id);

      if (existingProduct) {
        return state.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
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
          ? { ...item, quantity: item.quantity + 1 }
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
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);

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

