// src/components/PaymentForm.tsx

"use client";
import { useState, FormEvent } from 'react';
import { 
  PaymentElement, 
  useStripe, 
  useElements 
} from "@stripe/react-stripe-js";
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/styles/CheckoutPage.module.scss'; // Використовуємо ті ж стилі

// --- Інтерфейси ---

// Пропси, які ми отримуємо зі сторінки checkout
interface PaymentFormProps {
  orderId: number;
  clientSecret: string;
  customerData: {
    name: string;
    phone: string;
    address: string;
  };
}

// --- Компонент ---

const PaymentForm = ({ orderId, clientSecret, customerData }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  // Використовуємо useSearchParams для отримання return_url (хоча він тут не використовується, але може знадобитись)
  const searchParams = useSearchParams(); 

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js ще не завантажився.
      return;
    }

    setIsProcessing(true);

    const return_url = `${window.location.origin}/order-success?order_id=${orderId}&client_secret=${clientSecret}`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Переконуємось, що ми передаємо URL для повернення
        return_url: return_url,
        payment_method_data: {
          billing_details: {
            name: customerData.name,
            phone: customerData.phone,
            address: {
              line1: customerData.address,
              // Можна додати інші поля адреси, якщо вони у вас є
            },
          }
        }
      },
    });

    // Цей код виконається, лише якщо виникла негайна помилка (наприклад, невірно введена картка)
    // Якщо все добре, Stripe автоматично перенаправить користувача на 'return_url'
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || 'Виникла помилка. Перевірте введені дані.');
    } else {
      setMessage("Виникла неочікувана помилка.");
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className={styles.paymentForm}>
      <h3>Введіть дані оплати</h3>
      
      {/* Елемент оплати від Stripe (картка, Google Pay тощо) */}
      <PaymentElement id="payment-element" />
      
      <button disabled={isProcessing || !stripe || !elements} id="submit" className={styles.payButton}>
        <span id="button-text">
          {isProcessing ? "Обробка..." : "Сплатити"}
        </span>
      </button>
      
      {/* Повідомлення про помилки */}
      {message && <div id="payment-message" className={styles.paymentMessage}>{message}</div>}
    </form>
  );
};

export default PaymentForm;