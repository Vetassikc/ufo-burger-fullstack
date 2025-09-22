// src/components/PaymentForm.js

"use client";
import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import styles from '@/styles/CheckoutPage.module.scss';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const PaymentForm = ({ orderId, customerData, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clearCart } = useCart();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    // Ми більше не будемо перенаправляти вручну
    // А довіримо це Stripe, вказавши правильну return_url
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe автоматично додасть payment_intent до цієї URL
        return_url: `${window.location.origin}/order-success`, 
      },
    });

    // Цей код виконається, тільки якщо є помилка
    if (error) {
      setMessage(error.message);
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <h3>Введіть дані для оплати</h3>
      <PaymentElement id="payment-element" />
      <button 
        disabled={isProcessing || !stripe || !elements} 
        id="submit" 
        className={styles.formButton}
        style={{ marginTop: '20px' }} // Додамо трохи відступу
      >
        <span id="button-text">
          {isProcessing ? 'Обробка...' : 'Сплатити'}
        </span>
      </button>
      {message && <div id="payment-message" style={{ color: '#ff4d4d', marginTop: '15px' }}>{message}</div>}
    </form>
  );
};

export default PaymentForm;