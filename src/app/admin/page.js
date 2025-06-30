"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '@/styles/AdminPage.module.scss';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = async () => {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching orders:', error);
    else setOrders(ordersData);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await fetchOrders();
      } else {
        router.push('/login');
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => { /* ... ваш існуючий код ... */ };

  // НОВА ФУНКЦІЯ для оновлення статусу
  const handleStatusChange = async (orderId, newStatus) => {
    // 1. Оновлюємо локальний стан для миттєвої реакції
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    // 2. Відправляємо оновлення в базу даних
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating status:', error);
      alert('Не вдалося оновити статус.');
      // Якщо помилка, повертаємо старі дані, щоб користувач бачив правду
      await fetchOrders(); 
    }
  };

  if (loading) return <div className={styles.loading}>Завантаження даних...</div>;

  if (user) {
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
                    {/* ДОДАЄМО ВИПАДАЮЧИЙ СПИСОК */}
                    <select 
                      className={styles.statusSelect} 
                      value={order.status} 
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="new">Нове</option>
                      <option value="in_progress">В процесі</option>
                      <option value="completed">Завершено</option>
                      <option value="cancelled">Скасовано</option>
                    </select>
                  </div>
                  <p><strong>Клієнт:</strong> {order.customer_name}</p>
                  <p><strong>Телефон:</strong> {order.customer_phone}</p>
                  <p><strong>Адреса:</strong> {order.delivery_address}</p>
                  <p><strong>Сума:</strong> {order.total_price} CHF</p>
                  <div className={styles.orderItems}>
                    {/* ... решта коду для відображення складу замовлення ... */}
                  </div>
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
  }
  return <div className={styles.loading}>Перенаправлення...</div>;
};

export default AdminPage;