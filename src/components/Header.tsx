// src/components/Header.tsx

"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from '@/styles/Header.module.scss';
// ▼▼▼ ОСЬ ВИПРАВЛЕННЯ ІМПОРТУ ▼▼▼
import { FaCartShopping, FaUser, FaBars, FaXmark } from 'react-icons/fa6';

// 1. Визначаємо інтерфейс для пропсів
interface HeaderProps {
  onContactClick: () => void;
}

// 2. Застосовуємо інтерфейс до пропсів
const Header = ({ onContactClick }: HeaderProps) => {
  const { cartItems } = useCart();
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <Image src="/img/ufo-icon.png" alt="UFO Burger Logo" width={50} height={50} />
        <span>UFO Burger</span>
      </Link>
      
      <nav className={`${styles.nav} ${isNavOpen ? styles.navOpen : ''}`}>
        <Link href="/" onClick={() => setIsNavOpen(false)}>Головна</Link>
        <Link href="/menu" onClick={() => setIsNavOpen(false)}>Меню</Link>
        <Link href="/gallery" onClick={() => setIsNavOpen(false)}>Галерея</Link>
        {/* 3. Використовуємо onContactClick з пропсів */}
        <button 
          onClick={() => {
            onContactClick();
            setIsNavOpen(false);
          }} 
          className={styles.navContactBtn}
        >
          Контакти
        </button>
      </nav>
      
      <div className={styles.icons}>
        <Link href="/profile" className={styles.iconLink}>
          <FaUser />
        </Link>
        <Link href="/cart" className={styles.iconLink}>
          {/* ▼▼▼ ОСЬ ВИПРАВЛЕННЯ ІКОНКИ ▼▼▼ */}
          <FaCartShopping />
          {totalQuantity > 0 && (
            <span className={styles.cartCount}>{totalQuantity}</span>
          )}
        </Link>
        <button className={styles.mobileToggle} onClick={toggleNav}>
          {/* ▼▼▼ ОСЬ ВИПРАВЛЕННЯ ІКОНКИ ▼▼▼ */}
          {isNavOpen ? <FaXmark /> : <FaBars />}
        </button>
      </div>
    </header>
  );
};

export default Header;