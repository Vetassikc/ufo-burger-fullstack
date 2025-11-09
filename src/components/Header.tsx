// src/components/Header.tsx/
"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/Header.module.scss';
// useCart більше не потрібен тут
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { FaUser } from 'react-icons/fa6'; // FaCartShopping видалено

type HeaderProps = {
  onContactClick: () => void; 
};

const Header = ({ onContactClick }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  // totalItems більше не потрібен тут
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLLIElement>(null);

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
                <li 
                  className={styles.profileMenuContainer}
                  ref={profileMenuRef} 
                  onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <a className={pathname === '/profile' ? styles.active : ''} style={{cursor: 'pointer'}}>
                    <FaUser style={{ fontSize: '1.5rem' }} />
                  </a>
                  
                  {isProfileMenuOpen && (
                    <div className={styles.profileMenu}>
                      <Link href="/profile" className={styles.profileMenuLink} onClick={() => setProfileMenuOpen(false)}>
                        Мій Профіль
                      </Link>
                      <button onClick={handleLogout} className={styles.profileMenuButton}>
                        Вийти
                      </button>
                    </div>
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
          
          {/* --- ▼▼▼ ІКОНКА КОШИКА ВИДАЛЕНА ЗВІДСИ ▼▼▼ --- */}
          
        </div>
      </div>
    </header>
  );
};

export default Header;