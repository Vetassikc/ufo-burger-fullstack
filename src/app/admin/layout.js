import Link from 'next/link';
import styles from '@/styles/AdminPage.module.scss';

// Цей шаблон буде автоматично обгортати всі сторінки всередині папки /admin
export default function AdminLayout({ children }) {
  return (
    <div className={styles.adminLayout}>
      <nav className={styles.adminNav}>
        <Link href="/admin">Замовлення</Link>
        <Link href="/admin/menu">Керування меню</Link>
      </nav>
      {children}
    </div>
  );
}