"use client";

import { useCart } from '@/context/CartContext';
import styles from '@/styles/CartPage.module.scss';
import { useRouter } from 'next/navigation';
// Імпортуємо тип CartItem з контексту
import type { CartItem } from '@/context/CartContext'; 

export default function CartPage() {
  // 1. ВИПРАВЛЕНО: Деструктуризуємо totalPrice (значення) та updateQuantity (функцію)
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, // <--- Тепер ця функція існує
    clearCart, 
    totalPrice // <--- Тепер це значення, а не функція
  } = useCart();
  
  const router = useRouter();
  
  // 2. Рядок 'const totalPrice = getTotalPrice();' ВИДАЛЕНО, він був неправильний

  const handleCheckout = () => {
    router.push('/checkout');
  };

  // 3. Додаємо тип 'item: CartItem'
  const renderCartItem = (item: CartItem) => (
    <div key={item.id} className={styles.cartItem}>
      <div className={styles.itemInfo}>
        <h4>{item.name}</h4>
        <p>{item.price} CHF</p>
      </div>
      <div className={styles.itemActions}>
        <div className={styles.quantityControl}>
          {/* 4. ВИПРАВЛЕНО: Використовуємо updateQuantity */}
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
        </div>
        <button onClick={() => removeFromCart(item.id)} className={styles.removeButton}>
          Видалити
        </button>
      </div>
    </div>
  );

  return (
    <main className={styles.cartPage}>
      <div className={styles.cartContainer}>
        <h1 className={styles.pageTitle}>Ваш Кошик</h1>
        {cartItems.length === 0 ? (
          <p>Ваш кошик порожній.</p>
        ) : (
          <>
            <div className={styles.cartItemsList}>
              {cartItems.map(renderCartItem)}
            </div>
            <div className={styles.cartSummary}>
              {/* 5. ВИПРАВЛЕНО: Використовуємо totalPrice напряму */}
              <p className={styles.totalPrice}>Всього: {totalPrice.toFixed(2)} CHF</p>
              <div className={styles.summaryActions}>
                <button onClick={clearCart} className={styles.clearButton}>
                  Очистити кошик
                </button>
                <button onClick={handleCheckout} className={styles.checkoutButton}>
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