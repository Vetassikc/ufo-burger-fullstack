// src/components/Header.tsx

"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from '@/styles/Header.module.scss';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js'; // Імпортуємо тип User

// Описуємо типи для props, які отримує компонент
type HeaderProps = {
  onContactClick: () => void; // Функція, яка нічого не повертає
};

const Header = ({ onContactClick }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  // Чітко вказуємо, що user може бути User або null
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Отримуємо поточного користувача
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Cлідкуємо за зміною стану аутентифікації
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Після виходу повертаємо на головну
  };

  const headerClasses = `${styles.mainHeader} ${isScrolled ? styles.scrolled : ''}`;

  return (
    <header className={headerClasses}>
      <div className={styles.headerContainer}>
        <nav className={`${styles.headerNav} ${styles.leftNav}`}>
          <ul>
            <li><Link href="/" className={pathname === '/' ? styles.active : ''}>Головна</Link></li>
            <li><Link href="/menu" className={pathname === '/menu' ? styles.active : ''}>Меню</Link></li>
            <li><Link href="/gallery" className={pathname === '/gallery' ? styles.active : ''}>Галерея</Link></li>
          </ul>
        </nav>

        <div className={styles.headerLogo}>
          <Link href="/">UFO</Link>
        </div>

        <div className={styles.rightSection}>
          <nav className={`${styles.headerNav} ${styles.rightNav}`}>
            <ul>
              {user ? (
                <>
                  <li><Link href="/profile" className={pathname === '/profile' ? styles.active : ''}>Профіль</Link></li>
                  <li><button onClick={handleLogout} className={styles.authButton}>Вийти</button></li>
                </>
              ) : (
                <>
                  <li><Link href="/login" className={styles.authButton}>Увійти</Link></li>
                  <li><Link href="/register" className={`${styles.authButton} ${styles.primary}`}>Зареєструватися</Link></li>
                </>
              )}
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