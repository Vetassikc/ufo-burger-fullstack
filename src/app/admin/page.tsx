// src/app/admin/page.tsx
"use client";
import { useEffect, useState, ChangeEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '@/styles/AdminPage.module.scss';
import type { User } from '@supabase/supabase-js';

type OrderStatus = 'new' | 'in_progress' | 'completed' | 'cancelled' | 'succeeded' | string;

interface Order {
  id: number;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  total_price: number;
  status: OrderStatus;
  order_items: any[]; 
}

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchOrders = async () => {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .returns<Order[]>();

    if (error) console.error('Error fetching orders:', error);
    else if (ordersData) setOrders(ordersData);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await fetchOrders();
      } else {
        router.push('/admin/login');
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); 
  };

  // --- ▼▼▼ ВІДНОВЛЕННЯ ЛОГІКИ ЗМІНИ СТАТУСУ ▼▼▼ ---
  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
    if (error) {
      alert('Не вдалося оновити статус.');
      await fetchOrders(); 
    }
  };

  if (loading) return <p className={styles.loading}>Завантаження даних...</p>;
  
  // --- ▼▼▼ ВИПРАВЛЕННЯ КЛАСІВ (КАРТКИ) ▼▼▼ ---
  return (
    <main className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1>Адмін-панель</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>Вийти</button>
      </div>
      <div className={styles.content}>
        <h2>Останні замовлення</h2>
        {orders.length > 0 ? (
          <div className={styles.ordersTable}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderCardHeader}>
                  <strong>Замовлення #{order.id}</strong>
                  <select 
                    className={styles.statusSelect} 
                    value={order.status} 
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <option value="new">Нове</option>
                    <option value="in_progress">В процесі</option>
                    <option value="succeeded">Успішно (Оплачено)</option>
                    <option value="completed">Завершено</option>
                    <option value="cancelled">Скасовано</option>
                  </select>
                </div>
                <p><strong>Клієнт:</strong> {order.customer_name}</p>
                <p><strong>Телефон:</strong> {order.customer_phone}</p>
                <p><strong>Адреса:</strong> {order.delivery_address}</p>
                <p><strong>Сума:</strong> {order.total_price.toFixed(2)} CHF</p>
                <p className={styles.orderDate}>
                  {new Date(order.created_at).toLocaleString('de-CH')}
                </p>
              </div>
            ))}
          </div>
        ) : ( <p>Нових замовлень поки що немає.</p> )}
      </div>
    </main>
  );
};

export default AdminDashboard;