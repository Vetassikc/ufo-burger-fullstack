// src/components/Footer.tsx
"use client"; // <-- 1. Додаємо "use client"
import React from 'react'; // <-- 2. Додаємо React
import Link from 'next/link';
import styles from '@/styles/Footer.module.scss';

// 3. Визначаємо інтерфейс для пропсів
interface FooterProps {
  onContactClick: () => void;
}

// 4. Застосовуємо інтерфейс
const Footer = ({ onContactClick }: FooterProps) => {
  return (
    <footer className={styles.mainFooter}>
      <div className={styles.footerContainer}>
        <div className={styles.footerColumn}>
          <h3 className={styles.footerLogo}>UFO</h3>
          <p>© 2025 UFO Burger. Всі права захищено.</p>
        </div>
        <div className={styles.footerColumn}>
          <h4>Навігація</h4>
          <ul>
            <li><Link href="/">Головна</Link></li>
            <li><Link href="/menu">Меню</Link></li>
            <li><Link href="/gallery">Галерея</Link></li>
            {/* 5. Замінюємо Link на <a> з onClick */}
            <li>
              <a onClick={onContactClick} style={{ cursor: 'pointer' }}>
                Контакти
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h4>Контакти</h4>
          <p>Olena</p>
          <p>ufo.burger.zurich@gmail.com</p>
          <p>+41 79 123 45 67</p>
        </div>
        <div className={styles.footerColumn}>
          <h4>Слідкуйте</h4>
          {/* Тут будуть іконки соцмереж */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;