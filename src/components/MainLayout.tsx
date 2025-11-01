// src/components/MainLayout.tsx
"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation'; // <-- 1. Імпортуємо usePathname
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';
import CookieConsentModal from '@/components/CookieConsentModal'; // <-- 2. Імпортуємо Cookie Modal

// Типізуємо props
type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const pathname = usePathname(); // <-- 3. Отримуємо поточний шлях

  // --- 4. Логіка для приховування Header/Footer ---
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  // Показуємо layout (Header/Footer) тільки якщо це НЕ адмін і НЕ авторизація
  const showLayout = !isAdminRoute && !isAuthRoute; 
  // --- Кінець логіки ---

  // Обробники для модального вікна
  const openContactModal = () => setContactModalOpen(true);
  const closeContactModal = () => setContactModalOpen(false);

  // 5. Умовно рендеримо layout
  if (showLayout) {
    return (
      <>
        {/* Header приймає onContactClick */}
        <Header onContactClick={openContactModal} /> 
        <main>{children}</main>
        {/* Footer приймає onContactClick */}
        <Footer onContactClick={openContactModal} /> 
        
        <CookieConsentModal /> 
        {isContactModalOpen && <ContactModal onClose={closeContactModal} />}
      </>
    );
  }

  // Для /admin, /login, /register повертаємо ТІЛЬКИ children
  // Це виправляє помилку <main> в <main> і лагодить CSS
  return (
    <>
      {children}
      {/* Ми також показуємо Cookie Modal на сторінках входу */}
      <CookieConsentModal /> 
    </>
  );
}