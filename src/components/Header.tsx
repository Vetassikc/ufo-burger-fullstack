// src/components/Header.tsx
"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/Header.module.scss';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { FaCartShopping, FaUser } from 'react-icons/fa6'; 
import { motion } from 'framer-motion'; // <-- 1. Імпортуємо motion

type HeaderProps = {
  onContactClick: () => void; 
};

const Header = ({ onContactClick }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    // ... (вся логіка useEffect залишається без змін) ...
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

    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription?.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setProfileMenuOpen(false); 
    await supabase.auth.signOut();
    router.push('/');
  };

  const headerClasses = `${styles.mainHeader} ${isScrolled ? styles.scrolled : ''}`;

  return (
    // 2. Прибираємо анімацію .variants з <header>
    <header className={headerClasses}>
      <div className={styles.headerContainer}>
        <nav className={`${styles.headerNav} ${styles.leftNav}`}>
          <ul>
            {/* 3. Прибираємо 'motion.li' для стабільності */}
            <li>
              <Link href="/" className={pathname === '/' ? styles.active : ''}>Головна</Link>
            </li>
            <li>
              <Link href="/menu" className={pathname === '/menu' ? styles.active : ''}>Меню</Link>
            </li>
            <li>
              <Link href="/gallery" className={pathname === '/gallery' ? styles.active : ''}>Галерея</Link>
            </li>
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
                // 4. Кнопка профілю тепер завжди видима
                <li 
                  className={styles.profileMenuContainer}
                  ref={profileMenuRef} 
                  onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <a className={pathname === '/profile' ? styles.active : ''} style={{cursor: 'pointer'}}>
                    <FaUser style={{ fontSize: '1.5rem' }} />
                  </a>
                  
                  {isProfileMenuOpen && (
                    // 5. Анімуємо ТІЛЬКИ випадаюче меню
                    <motion.div 
                      className={styles.profileMenu}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href="/profile" className={styles.profileMenuLink} onClick={() => setProfileMenuOpen(false)}>
                        Мій Профіль
                      </Link>
                      <button onClick={handleLogout} className={styles.profileMenuButton}>
                        Вийти
                      </button>
                    </motion.div>
                  )}
                </li>
              ) : (
                <>
                  <li><Link href="/login" className={styles.authButton}>Увійти</Link></li>
                  <li><Link href="/register" className={`${styles.authButton} ${styles.primary}`}>Зареєструватися</Link></li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;