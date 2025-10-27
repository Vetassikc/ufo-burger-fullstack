// src/components/MainLayout.tsx

"use client";
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';

// Типізуємо props, які компонент отримує
type MainLayoutProps = {
  children: React.ReactNode; // React.ReactNode - це будь-який валідний React-елемент
};

export default function MainLayout({ children }: MainLayoutProps) {
  const [isContactModalOpen, setContactModalOpen] = useState(false);

  return (
    <>
      <Header onContactClick={() => setContactModalOpen(true)} />
      <main>{children}</main>
      <Footer />
      {isContactModalOpen && <ContactModal onClose={() => setContactModalOpen(false)} />}
    </>
  );
}