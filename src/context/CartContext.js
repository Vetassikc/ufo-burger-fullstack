"use client";
import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (itemToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === itemToAdd.id);

      if (existingItem) {
        // Якщо товар вже є, збільшуємо кількість
        return prevItems.map((item) =>
          item.id === itemToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Якщо товару немає, додаємо його з кількістю 1
        return [...prevItems, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const decreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Додаємо clearCart в value
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, decreaseQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);