// src/app/admin/page.tsx

"use client";
import { useEffect, useState, ChangeEvent } from 'react'; // <-- Додано ChangeEvent
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '@/styles/AdminPage.module.scss'; //
import type { User } from '@supabase/supabase-js';

// --- Інтерфейси ---
type OrderStatus = 'new' | 'in_progress' | 'completed' | 'cancelled' | string;

interface Order {
  id: number;
  created_at: string;
  customer_name: string; // <-- Змінено з 'name'
  customer_phone: string; // <-- Змінено з 'phone'
  delivery_address: string;
  total_price: number;
  status: OrderStatus;
  order_items: any[]; // Можна уточнити, якщо потрібно
}

// --- Компонент ---
const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // --- ▼▼▼ ЛОГІКА З .js ВЕРСІЇ (З ТИПАМИ) ▼▼▼ ---
  const fetchOrders = async () => {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .returns<Order[]>(); // Типізуємо відповідь

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
        router.push('/admin/login'); // Редірект на логін адмінки
      }
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); 
  };

  // Функція оновлення статусу
  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    // 1. Оптимістичне оновлення UI
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    // 2. Запит в БД
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating status:', error);
      alert('Не вдалося оновити статус.');
      await fetchOrders(); // Повертаємо актуальні дані з БД
    }
  };

  if (loading) return <p className={styles.loading}>Завантаження даних...</p>;
  
  // --- ▼▼▼ ВИПРАВЛЕНА JSX-СТРУКТУРА (КАРТКИ) ▼▼▼ ---
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
                  {/* Випадаючий список для статусу */}
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
                {/* <div className={styles.orderItems}>
                  <ul>
                    {order.order_items.map((item: any) => (
                      <li key={item.id}>{item.name} x {item.quantity}</li>
                    ))}
                  </ul>
                </div> 
                */}
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