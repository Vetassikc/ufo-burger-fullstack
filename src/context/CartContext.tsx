// src/context/CartContext.tsx

"use client";
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// --- Описуємо типи ---

// 1. Тип для одного товару в кошику
// (В ідеалі, його варто винести в src/types/index.ts)
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null; // <-- Важливо: null, бо з меню може прийти null
  quantity: number;
  // Додаємо поля, яких може не бути в CartItem, але є в MenuItem
  created_at?: string;
  description?: string;
  category?: string;
}

// 2. Тип для об'єкта, який надає наш Context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void; // <-- ДОДАНО
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

// 3. Тип для props нашого Провайдера
type CartProviderProps = {
  children: ReactNode;
};

// --- Створюємо Context ---
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
        // Збільшуємо кількість
        return prevItems.map(item =>
          item.id === itemToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Додаємо новий товар (переконуємось, що quantity 1)
      return [...prevItems, { ...itemToAdd, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // ▼▼▼ НОВА ФУНКЦІЯ, ЯКОЇ НЕ ВИСТАЧАЛО ▼▼▼
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Якщо кількість 0 або менше, видаляємо товар
      removeFromCart(itemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };
  // ▲▲▲ НОВА ФУНКЦІЯ ▲▲▲


  // --- Розрахунки ---
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity, // <-- ДОДАНО У ПРОВАЙДЕР
      clearCart,
      totalPrice,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

// --- Створюємо Хук ---
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};