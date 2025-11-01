// src/app/admin/layout.tsx
import Link from 'next/link';
import styles from '@/styles/AdminPage.module.scss';
import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    // --- ▼▼▼ ВИПРАВЛЕННЯ КЛАСІВ ▼▼▼ ---
    <div className={styles.adminLayout}>
      <nav className={styles.adminNav}>
        <Link href="/admin">Огляд (Замовлення)</Link>
        <Link href="/admin/menu">Керування меню</Link>
        <Link href="/">Повернутись на сайт</Link>
      </nav>
      <div> 
        {children}
      </div>
    </div>
  );
}