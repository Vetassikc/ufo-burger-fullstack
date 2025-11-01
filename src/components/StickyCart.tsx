// src/components/StickyCart.tsx
"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from '@/styles/StickyCart.module.scss'; // Ми створимо цей файл стилів
import { FaCartShopping } from 'react-icons/fa6';
import { useEffect, useState } from 'react';

const StickyCart = () => {
  const { totalItems } = useCart();
  const [isClient, setIsClient] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Ефект для анімації при додаванні товару
  useEffect(() => {
    if (totalItems > 0) {
      setAnimate(true);
      // Скидаємо анімацію через 300мс (тривалість анімації)
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]); // Анімація спрацьовує при зміні totalItems

  // Ефект, щоб компонент рендерився тільки на клієнті
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Не рендеримо нічого на сервері, щоб уникнути помилок гідратації
  }

  // Використовуємо анімований клас, якщо animate === true
  const cartClasses = `${styles.stickyCart} ${animate ? styles.animate : ''}`;

  return (
    <Link href="/cart" className={cartClasses}>
      <FaCartShopping className={styles.icon} />
      {totalItems > 0 && (
        <span className={styles.cartCount}>{totalItems}</span>
      )}
    </Link>
  );
};

export default StickyCart;