// src/components/MainLayout.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';
import CookieConsentModal from '@/components/CookieConsentModal';
import StickyCart from '@/components/StickyCart'; // <-- 1. Імпортуємо новий компонент

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const showLayout = isClient && !isAdminRoute && !isAuthRoute;

  const openContactModal = () => setContactModalOpen(true);
  const closeContactModal = () => setContactModalOpen(false);

  return (
    <>
      {showLayout ? (
        <>
          <Header onContactClick={openContactModal} />
          <main>{children}</main>
          <Footer onContactClick={openContactModal} />
          <StickyCart /> {/* <-- 2. Додаємо стікі-кошик сюди */}
        </>
      ) : (
        <>{children}</>
      )}

      <CookieConsentModal /> 
      {isContactModalOpen && <ContactModal onClose={closeContactModal} />}
    </>
  );
}