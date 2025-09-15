"use client";
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import styles from '@/styles/CheckoutPage.module.scss';
import PaymentForm from '@/components/PaymentForm';

// Опублікований ключ Stripe (НЕ СЕКРЕТНИЙ КЛЮЧ!)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const { cartItems, totalPrice } = useCart();
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const orderData = {
      ...formData,
      order_items: cartItems,
      total_price: totalPrice,
    };

    try {
      // Відправляємо запит до API, щоб отримати client_secret для оплати
      const response = await fetch('/api/create-stripe-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Помилка при створенні платіжної сесії.');
      }

      const { clientSecret, orderId } = await response.json();
      
      setClientSecret(clientSecret);
      setOrderId(orderId);
      setIsFormSubmitted(true); // Показуємо платіжну форму
      
    } catch (error) {
      alert(error.message);
      setIsProcessing(false);
    }
  };

  const appearance = {
    theme: 'dark',
    variables: {
      colorPrimary: '#FFD700',
      colorBackground: '#1c1c2e',
      colorText: '#FFFFFF',
      colorDanger: '#ef4444',
      fontFamily: 'Montserrat, sans-serif',
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <main className={styles.checkoutSection}>
      <div className={styles.checkoutContainer}>
        <h1>Оформлення замовлення</h1>
        <div className={styles.grid}>
          <div className={styles.formWrapper}>
            {!isFormSubmitted ? (
              <form onSubmit={handleContactSubmit}>
                <h3>Ваші контактні дані</h3>
                <input type="text" name="name" placeholder="Ім'я та прізвище" required onChange={handleInputChange} />
                <input type="tel" name="phone" placeholder="Номер телефону" required onChange={handleInputChange} />
                <input type="text" name="address" placeholder="Адреса доставки" required onChange={handleInputChange} />
                <button type="submit" disabled={isProcessing}>
                  {isProcessing ? 'Обробка...' : `Підтвердити дані та перейти до оплати`}
                </button>
              </form>
            ) : (
              // Відображаємо платіжну форму Stripe після заповнення контактних даних
              clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                  <PaymentForm 
                    orderId={orderId} 
                    customerData={formData}
                    clientSecret={clientSecret}
                  />
                </Elements>
              )
            )}
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