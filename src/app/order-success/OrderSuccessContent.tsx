// src/app/order-success/OrderSuccessContent.tsx
"use client";

import { useEffect, useState, useRef } from 'react'; // <-- 1. Додаємо useRef
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import styles from '@/styles/SuccessPage.module.scss';

type VerificationStatus = 'loading' | 'success' | 'error';

interface VerifyResponse {
  success: boolean;
  message: string;
}

const OrderSuccessContent = () => {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState<string | null>(null);

  // 2. Використовуємо ref, щоб відстежити, чи був вже відправлений запит
  const verificationSent = useRef(false);

  // 3. Витягуємо значення ЗА МЕЖАМИ useEffect
  const order_id = searchParams.get('order_id');
  const client_secret = searchParams.get('client_secret');

  useEffect(() => {
    // 4. Перевіряємо, чи є параметри І чи запит ще не відправлявся
    if (order_id && client_secret && !verificationSent.current) {
      
      // 5. Позначаємо, що ми відправляємо запит
      verificationSent.current = true; 

      const verifyPayment = async () => {
        try {
          const response = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id, client_secret }),
          });

          const data: VerifyResponse = await response.json();

          if (data.success) {
            setStatus('success');
            setMessage(data.message || 'Оплата успішна!');
            clearCart(); // Очищуємо кошик ОДИН раз
          } else {
            setStatus('error');
            setMessage(data.message || 'Помилка верифікації платежу.');
          }
        } catch (error: any) {
          console.error("Verification error:", error);
          setStatus('error');
          setMessage(error.message || 'Сталася помилка на сервері.');
        }
      };

      verifyPayment();
    }
    
    // 6. Тепер залежності - це стабільні рядки (або null)
  }, [order_id, client_secret, clearCart]); // clearCart - стабільна функція з context

  if (status === 'loading') {
    return (
      <div className={styles.container}>
         <p>Верифікація вашого платежу...</p>
      </div>
    );
  }
  
  // ... решта JSX без змін ...
  return (
    <div className={styles.container}>
      {status === 'success' ? (
        <>
          <h1 className={styles.title}>Замовлення успішно оформлено!</h1>
          <p className={styles.message}>{message}</p>
          <p>Дякуємо, що обрали UFO Burger. Ваш бургер вже в дорозі!</p>
          <Link href="/menu" className={styles.linkButton}>
            Повернутися до меню
          </Link>
        </>
      ) : (
        <>
          <h1 className={styles.titleError}>Помилка оплати</h1>
          <p className={styles.message}>{message}</p>
          <p>Будь ласка, спробуйте ще раз або зв&apos;яжіться з підтримкою.</p>
          <Link href="/checkout" className={styles.linkButton}>
            Повернутися до оплати
          </Link>
        </>
      )}
    </div>
  );
};

export default OrderSuccessContent;