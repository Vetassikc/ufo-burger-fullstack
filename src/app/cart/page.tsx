// src/app/cart/page.tsx
"use client";

import { useCart } from '@/context/CartContext';
import styles from '@/styles/CartPage.module.scss';
import { useRouter } from 'next/navigation';
import type { CartItem } from '@/context/CartContext'; 
import Image from 'next/image';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const router = useRouter();
  const handleCheckout = () => router.push('/checkout');

  // --- ▼▼▼ ВИПРАВЛЕННЯ КЛАСІВ ТА СТРУКТУРИ ▼▼▼ ---
  const renderCartItem = (item: CartItem) => (
    <div key={item.id} className={styles.cartItem}>
      <div className={styles.itemImage}>
        <Image 
          src={item.image_url || '/img/ufo-icon.png'}
          alt={item.name} 
          width={80} 
          height={80} 
          style={{ objectFit: 'cover', borderRadius: '8px' }} 
        />
      </div>
      <div className={styles.itemDetails}>
        <h4>{item.name}</h4>
      </div>
      <div className={styles.itemQuantity}>
        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
      </div>
      <div className={styles.itemTotal}>
        {(item.price * item.quantity).toFixed(2)} CHF
      </div>
      <div className={styles.itemRemove}>
        <button onClick={() => removeFromCart(item.id)}>&times;</button>
      </div>
    </div>
  );

  return (
    <main className={styles.cartSection}> 
      <div className={styles.cartContainer}>
        <h1 className={styles.pageTitle}>Ваш Кошик</h1>
        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <h2>Ваш кошик порожній</h2>
            <p>Схоже, ви ще не додали жодного космічного бургера.</p>
            <button onClick={() => router.push('/menu')} className={styles.ctaButton}>
              До меню
            </button>
          </div>
        ) : (
          <>
            <div className={styles.cartItems}> 
              {cartItems.map(renderCartItem)}
            </div>
            <div className={styles.cartSummary}>
              <h2>Всього: {totalPrice.toFixed(2)} CHF</h2>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <button 
                  onClick={clearCart} 
                  className={styles.ctaButton} 
                  style={{ backgroundColor: 'transparent', color: 'var(--text-secondary-color)', borderColor: 'var(--text-secondary-color)' }}
                >
                  Очистити кошик
                </button>
                <button onClick={handleCheckout} className={styles.ctaButton}>
                  Оформити замовлення
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}