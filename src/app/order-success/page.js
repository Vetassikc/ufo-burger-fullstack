"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from '@/styles/SuccessPage.module.scss';

const OrderSuccessPage = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (sessionId) {
      // Відправляємо запит до нашого API, щоб підтвердити платіж
      fetch(`/api/stripe-webhook?sessionId=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            setIsSuccess(true);
            clearCart(); // Очищаємо кошик після успішного замовлення
          } else {
            setIsSuccess(false);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setIsSuccess(false);
          setLoading(false);
        });
    }
  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <main className={styles.successContainer}>
        <h1>Обробка вашого замовлення...</h1>
        <p>Будь ласка, зачекайте.</p>
      </main>
    );
  }

  if (isSuccess) {
    return (
      <main className={styles.successContainer}>
        <h1>🚀 Дякуємо за замовлення!</h1>
        <p>Ваше космічне замовлення вже готується до відправки.</p>
        <Link href="/menu" className={styles.ctaButton}>Повернутися до меню</Link>
      </main>
    );
  } else {
    return (
      <main className={styles.successContainer}>
        <h1>❌ Помилка замовлення</h1>
        <p>Сталася помилка при обробці вашого платежу. Будь ласка, спробуйте ще раз.</p>
        <Link href="/checkout" className={styles.ctaButton}>Повернутися до оформлення</Link>
      </main>
    );
  }
};

export default OrderSuccessPage;