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

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success?orderId=${orderId}`,
        shipping: {
          name: customerData.name,
          address: {
            line1: customerData.address,
            postal_code: '8001', // Приклад, вам потрібно буде отримати поштовий індекс
            city: 'Zurich',
            country: 'CH',
          },
        },
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Payment succeeded!');
      // Якщо платіж успішний, очищаємо кошик і перенаправляємо
      clearCart();
      router.push(`/order-success?orderId=${orderId}`);
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button 
        disabled={isProcessing || !stripe || !elements} 
        id="submit" 
        className={styles.formButton}
      >
        <span id="button-text">
          {isProcessing ? 'Обробка...' : 'Підтвердити замовлення'}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

export default PaymentForm;