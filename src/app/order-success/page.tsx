// src/app/order-success/page.tsx
import React, { Suspense } from 'react';
import OrderSuccessContent from './OrderSuccessContent';
import styles from '@/styles/SuccessPage.module.scss'; // Підключаємо стилі

// Компонент-заглушка для Suspense
const LoadingState = () => (
  <div className={styles.container}>
    <p>Завантаження...</p>
    {/* Тут може бути ваш спіннер, якщо він є у стилях */}
  </div>
);

// Це Server Component, який обгортає клієнтський компонент у Suspense
// Це дозволяє сторінці рендеритися на сервері, поки клієнтський компонент
// чекає на параметри URL.
const OrderSuccessPage = () => {
  return (
    <main className={styles.pageContainer}> {/* Використовуємо загальний контейнер сторінки */}
      <Suspense fallback={<LoadingState />}>
        <OrderSuccessContent />
      </Suspense>
    </main>
  );
};

export default OrderSuccessPage;