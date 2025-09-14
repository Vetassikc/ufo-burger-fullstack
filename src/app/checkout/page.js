"use client";
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { loadStripe } from '@stripe/stripe-js'; // Імпортуємо loadStripe
import styles from '@/styles/CheckoutPage.module.scss';

// Опублікований ключ Stripe (НЕ СЕКРЕТНИЙ КЛЮЧ!)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const stripe = await stripePromise;

    const orderData = {
      customer_name: formData.name,
      customer_phone: formData.phone,
      delivery_address: formData.address,
      order_items: cartItems,
      total_price: totalPrice,
    };

    // Створюємо Checkout-сесію через наш майбутній API-маршрут
    const response = await fetch('/api/create-stripe-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      const session = await response.json();
      // Перенаправляємо користувача на сторінку оплати Stripe
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        alert(result.error.message);
        setIsSubmitting(false);
      }
    } else {
      alert('Помилка при створенні сесії оплати. Спробуйте ще раз.');
      setIsSubmitting(false);
    }
  };

  // ... решта коду залишається незмінною ...
  return (
    <main className={styles.checkoutSection}>
      <div className={styles.checkoutContainer}>
        <h1>Оформлення замовлення</h1>
        <div className={styles.grid}>
          <div className={styles.formWrapper}>
            <form onSubmit={handleSubmit}>
              <h3>Ваші контактні дані</h3>
              <input type="text" name="name" placeholder="Ім'я та прізвище" required onChange={handleInputChange} />
              <input type="tel" name="phone" placeholder="Номер телефону" required onChange={handleInputChange} />
              <input type="text" name="address" placeholder="Адреса доставки" required onChange={handleInputChange} />
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Обробка...' : `Підтвердити замовлення на ${totalPrice.toFixed(2)} CHF`}
              </button>
            </form>
          </div>
          <div className={styles.summary}>
            <h3>Ваше замовлення</h3>
            {cartItems.map(item => (
              <div key={item.id} className={styles.summaryItem}>
                <span>{item.name} x {item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)} CHF</span>
              </div>
            ))}
            <hr />
            <div className={styles.summaryTotal}>
              <strong>Всього:</strong>
              <strong>{totalPrice.toFixed(2)} CHF</strong>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;