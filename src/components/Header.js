"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from '@/styles/Header.module.scss';
import { useCart } from '@/context/CartContext';

// Ми більше не імпортуємо useTranslations

const Header = ({ onContactClick }) => {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const headerClasses = `${styles.mainHeader} ${isScrolled ? styles.scrolled : ''}`;

  return (
    <header className={headerClasses}>
      <div className={styles.headerContainer}>
        <nav className={`${styles.headerNav} ${styles.leftNav}`}>
          <ul>
            {/* Повертаємо статичний текст замість t('home') */}
            <li><Link href="/" className={pathname === '/' ? styles.active : ''}>Головна</Link></li>
            <li><Link href="/menu" className={pathname === '/menu' ? styles.active : ''}>Меню</Link></li>
          </ul>
        </nav>
        <div className={styles.headerLogo}>
          <Link href="/">UFO</Link>
        </div>
        <div className={styles.rightSection}>
          <nav className={`${styles.headerNav} ${styles.rightNav}`}>
            <ul>
              {/* Повертаємо статичний текст */}
              <li><Link href="/gallery" className={pathname === '/gallery' ? styles.active : ''}>Галерея</Link></li>
              <li><button onClick={onContactClick} className={styles.contactButton}>Контакти</button></li>
            </ul>
          </nav>
          <Link href="/cart" className={styles.cartIcon}>
            🛒
            {totalItems > 0 && (
              <span className={styles.cartCount}>{totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;