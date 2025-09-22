"use client";
import { useEffect, useState } from 'react'; // <-- ОСЬ ТУТ ВИПРАВЛЕНО
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from '@/styles/SuccessPage.module.scss';

const OrderSuccessContent = () => {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const { clearCart } = useCart();

  const [status, setStatus] = useState('processing');
  const [hasVerified, setHasVerified] = useState(false);

  useEffect(() => {
    if (paymentIntentId && !hasVerified) {
      setHasVerified(true);

      fetch(`/api/verify-payment?payment_intent_id=${paymentIntentId}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            setStatus('success');
            clearCart();
          } else {
            setStatus('failed');
          }
        })
        .catch(err => {
          console.error(err);
          setStatus('failed');
        });
    } else if (!paymentIntentId) {
        setStatus('failed');
    }
  }, [paymentIntentId, hasVerified, clearCart]);

  if (status === 'processing') {
    return (
      <main className={styles.successContainer}>
        <h1>Обробка вашого замовлення...</h1>
        <p>Будь ласка, зачекайте.</p>
      </main>
    );
  }

  if (status === 'success') {
    return (
      <main className={styles.successContainer}>
        <h1>🚀 Дякуємо за замовлення!</h1>
        <p>Ваше космічне замовлення вже готується до відправки. Бали нараховано!</p>
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

export default OrderSuccessContent;