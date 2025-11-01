// src/components/MainLayout.tsx
"use client";

import React, { useState, useEffect } from 'react'; // <-- Додаємо useEffect
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';
import CookieConsentModal from '@/components/CookieConsentModal';

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  
  // --- ▼▼▼ ВИПРАВЛЕННЯ ГІДРАТАЦІЇ 1 ▼▼▼ ---
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Виконується тільки на клієнті
  }, []);

  // Визначаємо, чи потрібно показувати layout
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  
  // Показуємо layout, тільки якщо ми на клієнті І це не адмін/auth маршрут
  const showLayout = isClient && !isAdminRoute && !isAuthRoute;
  // --- ▲▲▲ КІНЕЦЬ ВИПРАВЛЕННЯ 1 ▲▲▲ ---

  const openContactModal = () => setContactModalOpen(true);
  const closeContactModal = () => setContactModalOpen(false);

  return (
    <>
      {showLayout ? (
        // Цей блок рендериться, тільки якщо showLayout = true
        <>
          <Header onContactClick={openContactModal} />
          <main>{children}</main>
          <Footer onContactClick={openContactModal} />
        </>
      ) : (
        // Для /admin, /login, /register та під час SSR рендеримо ТІЛЬКИ children
        <>{children}</>
      )}

      {/* Модальні вікна рендеряться завжди */}
      <CookieConsentModal /> 
      {isContactModalOpen && <ContactModal onClose={closeContactModal} />}
    </>
  );
}