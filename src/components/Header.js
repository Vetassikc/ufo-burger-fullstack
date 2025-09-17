// src/components/Header.js

"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from '@/styles/Header.module.scss';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabaseClient';

const Header = ({ onContactClick }) => {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // ▼▼▼ ПОЧАТОК НОВОЇ ЛОГІКИ ▼▼▼

    // Одразу перевіряємо, чи є користувач
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Підписуємось на зміни статусу автентифікації
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // ▼▼▼ КІНЕЦЬ НОВОЇ ЛОГІКИ ▼▼▼

    // Прибираємо слухачі при закритті компонента
    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription?.unsubscribe();
    };
  }, []);

  const headerClasses = `${styles.mainHeader} ${isScrolled ? styles.scrolled : ''}`;

  return (
    <header className={headerClasses}>
      <div className={styles.headerContainer}>
        <nav className={`${styles.headerNav} ${styles.leftNav}`}>
          <ul>
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
              <li><Link href="/gallery" className={pathname === '/gallery' ? styles.active : ''}>Галерея</Link></li>
              
              {/* Ось наша нова логіка */}
              {user && (
                <li><Link href="/profile" className={pathname === '/profile' ? styles.active : ''}>Профіль</Link></li>
              )}

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