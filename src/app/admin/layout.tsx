// src/app/admin/layout.tsx
import Link from 'next/link';
import styles from '@/styles/AdminPage.module.scss';
import React from 'react'; // Імпортуємо React для типу ReactNode

// 1. Визначаємо тип для пропсів
interface AdminLayoutProps {
  children: React.ReactNode;
}

// Це кореневий layout для всього, що всередині /admin
// Ми не будемо додавати сюди <Header> та <Footer>
// Але ми можемо додати Admin-специфічний <nav> або <aside>

// 2. Застосовуємо тип до пропсів
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className={styles.adminLayout}>
      <aside className={styles.adminSidebar}>
        <nav>
          <ul>
            <li>
              <Link href="/admin">Огляд (Замовлення)</Link>
            </li>
            <li>
              <Link href="/admin/menu">Керування меню</Link>
            </li>
            {/* Додайте інші посилання тут, напр. "Користувачі" */}
            <li>
              <Link href="/">Повернутись на сайт</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className={styles.adminContent}>
        {children}
      </div>
    </div>
  );
}