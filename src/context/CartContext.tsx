// src/context/CartContext.tsx

"use client";
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// --- Описуємо типи ---

// 1. Тип для одного товару в кошику
export interface CartItem {
  id: string; // Або number, залежно від вашої БД
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

// 2. Тип для об'єкта, який надає наш Context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

// 3. Тип для props нашого Провайдера
type CartProviderProps = {
  children: ReactNode;
};

// --- Створюємо Context ---

// Створюємо контекст з початковим значенням (або undefined)
// Ми використовуємо 'as', щоб TypeScript нам "повірив", що ми надамо ці функції
const CartContext = createContext<CartContextType>(undefined as any);

// --- Створюємо Провайдер ---

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Завантаження кошика з localStorage при першому рендері
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Збереження кошика в localStorage при будь-якій зміні
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (itemToAdd: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemToAdd.id);
      if (existingItem) {
        // Збільшуємо кількість, якщо товар вже є
        return prevItems.map(item =>
          item.id === itemToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Додаємо новий товар
        return [...prevItems, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemId);
      if (existingItem?.quantity === 1) {
        // Видаляємо товар, якщо кількість 1
        return prevItems.filter(item => item.id !== itemId);
      } else {
        // Зменшуємо кількість
        return prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Розраховуємо загальну суму та кількість
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
        totalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// --- Створюємо кастомний хук ---
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};