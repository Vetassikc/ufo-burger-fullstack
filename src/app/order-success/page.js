import Link from 'next/link';
import styles from '@/styles/SuccessPage.module.scss';

const OrderSuccessPage = () => {
  return (
    <main className={styles.successContainer}>
      <h1>🚀 Дякуємо за замовлення!</h1>
      <p>Ваше космічне замовлення вже готується до відправки.</p>
      <Link href="/menu" className={styles.ctaButton}>Повернутися до меню</Link>
    </main>
  );
};

export default OrderSuccessPage;