"use client";
import { useState } from 'react';
import { Orbitron, Montserrat } from 'next/font/google';
import '@/styles/globals.scss';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';
import { CartProvider } from '@/context/CartContext';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['700'], variable: '--font-orbitron' });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-montserrat' });

export default function RootLayout({ children }) {
  const [isContactModalOpen, setContactModalOpen] = useState(false);

  return (
    <html lang="uk">
      {/* 👇 Додаємо атрибут саме сюди 👇 */}
      <body className={`${orbitron.variable} ${montserrat.variable}`} suppressHydrationWarning={true}>
        <CartProvider>
          <Header onContactClick={() => setContactModalOpen(true)} />
          <main>
            {children}
          </main>
          <Footer />
          {isContactModalOpen && <ContactModal onClose={() => setContactModalOpen(false)} />}
        </CartProvider>
      </body>
    </html>
  );
}