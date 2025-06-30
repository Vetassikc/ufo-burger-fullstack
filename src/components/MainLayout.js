"use client";
import { useState, useEffect } from 'react'; // Додаємо useEffect
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';
import CookieConsentModal from '@/components/CookieConsentModal'; // Підключаємо компонент cookie-вікна

export default function MainLayout({ children }) {
  const [isContactModalOpen, setContactModalOpen] = useState(false);

  // Створюємо окремий стан для видимості cookie-вікна, початково - false
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  // Цей ефект виконається ТІЛЬКИ на клієнті, після першого рендеру
  useEffect(() => {
    // Перевіряємо, чи є згода, тільки в браузері
    if (!localStorage.getItem('cookieConsent')) {
      // Якщо згоди немає, встановлюємо стан, щоб показати вікно
      // Це відбудеться після гідрації, тому розбіжності не буде
      setShowCookieConsent(true); 
    }
  }, []); // Порожній масив означає, що ефект виконається один раз при завантаженні

  return (
    <CartProvider>
      <Header onContactClick={() => setContactModalOpen(true)} />
      <main>{children}</main>
      <Footer />

      {isContactModalOpen && <ContactModal onClose={() => setContactModalOpen(false)} />}

      {/* Показуємо вікно тільки якщо стан showCookieConsent === true */}
      {showCookieConsent && <CookieConsentModal />}

    </CartProvider>
  );
}