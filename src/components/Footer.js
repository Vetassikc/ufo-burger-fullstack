import Link from 'next/link';
import styles from '@/styles/Footer.module.scss';

const Footer = () => {
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
            <li><Link href="/contact">Контакти</Link></li>
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