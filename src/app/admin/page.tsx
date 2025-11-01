// src/app/admin/page.tsx

"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '@/styles/AdminPage.module.scss';
import type { User } from '@supabase/supabase-js';

// --- Інтерфейси ---

// Тип для статусу замовлення (відповідно до JS-файлу)
type OrderStatus = 'succeeded' | 'pending' | string; // 'pending' або інший, який ви використовуєте

// Типізуємо об'єкт замовлення
interface Order {
  id: number;
  created_at: string; // ISO string
  name: string;
  phone: string;
  total_price: number;
  status: OrderStatus;
  // Додайте сюди інші поля з таблиці 'orders', якщо вони потрібні
}

// --- Компонент ---

const AdminDashboard = () => {
  // 1. Типізуємо state
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // 'loading' для замовлень
  const [sessionLoading, setSessionLoading] = useState<boolean>(true); // 'sessionLoading' для перевірки сесії
  const router = useRouter();

  // 1. Перевірка сесії та отримання користувача
  useEffect(() => {
    const getSession = async () => {
      setSessionLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        router.push('/admin/login'); 
      } else {
        setUser(session.user);
      }
      setSessionLoading(false); // Завершили перевірку сесії
    };
    getSession();
  }, [router]);

  // 2. Отримання замовлень, коли користувач успішно визначений
  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        setLoading(true);
        // 2. Типізуємо запит до Supabase
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false }) 
          .limit(20)
          .returns<Order[]>(); // Чітко вказуємо тип відповіді

        if (error) {
          console.error('Error fetching orders:', error);
        } else if (data) {
          setOrders(data);
        }
        setLoading(false);
      };
      fetchOrders();
    }
  }, [user]); // Цей ефект залежить від [user]

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  // Поки йде перевірка сесії
  if (sessionLoading) {
    return <p className={styles.loading}>Перевірка сесії...</p>;
  }

  // Якщо сесію перевірили, але user === null (на випадок якщо редірект ще не спрацював)
  if (!user) {
    return null; // Або інший стан завантаження
  }

  return (
    <main className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>Адмін-панель: Останні замовлення</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>Вийти</button>
      </div>

      {loading ? (
        <p className={styles.loading}>Завантаження замовлень...</p>
      ) : (
        <div className={styles.ordersTableContainer}>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>ID Замовлення</th>
                <th>Дата</th>
                <th>Ім&apos;я</th>
                <th>Телефон</th>
                  <th>Сума</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{new Date(order.created_at).toLocaleString('de-CH')}</td>
                  <td>{order.name}</td>
                  <td>{order.phone}</td>
                  <td>{order.total_price.toFixed(2)} CHF</td>
                  <td>
                    <span className={`${styles.status} ${styles[order.status]}`}>
                      {order.status === 'succeeded' ? 'Успішно' : 'В обробці'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default AdminDashboard;