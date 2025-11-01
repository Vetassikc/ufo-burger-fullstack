// src/components/Header.tsx
"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from '@/styles/Header.module.scss';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { FaCartShopping, FaUser } from 'react-icons/fa6'; // <-- Правильні іконки

type HeaderProps = {
  onContactClick: () => void; 
};

const Header = ({ onContactClick }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

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
    router.push('/');
  };

  // --- ▼▼▼ ВИПРАВЛЕННЯ КЛАСІВ ▼▼▼ ---
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
              <li>
                <button onClick={onContactClick} className={styles.contactButton}>
                  Контакти
                </button>
              </li>
              {user ? (
                <>
                  <li><Link href="/profile" className={pathname === '/profile' ? styles.active : ''}><FaUser /></Link></li>
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
            <FaCartShopping />
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