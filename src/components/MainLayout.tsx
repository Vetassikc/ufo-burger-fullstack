// src/components/MainLayout.tsx
"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation'; // <-- Імпортуємо
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';
import CookieConsentModal from '@/components/CookieConsentModal'; // <-- Імпортуємо

// Типізуємо props
type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const pathname = usePathname(); // <-- Отримуємо шлях

  // Логіка, щоб приховати Header/Footer на сторінках входу та адмінки
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const showLayout = !isAdminRoute && !isAuthRoute;

  // Обробники для модального вікна
  const openContactModal = () => setContactModalOpen(true);
  const closeContactModal = () => setContactModalOpen(false);

  // Якщо це сторінка адмінки або входу, показуємо ТІЛЬКИ контент
  if (!showLayout) {
    return <>{children}</>;
  }

  // Для всіх інших сторінок показуємо повний layout
  return (
    <>
      {/* Ваш Header.tsx приймає onContactClick. 
        Але він не має кнопки "Контакти". 
        Ми все одно передамо її, щоб TS не лаявся.
      */}
      <Header onContactClick={openContactModal} />
      <main>{children}</main>
      
      {/* Передаємо openContactModal в Footer для відкриття модального вікна */}
      <Footer onContactClick={openContactModal} /> 

      <CookieConsentModal /> 
      {isContactModalOpen && <ContactModal onClose={closeContactModal} />}
    </>
  );
}