"use client";
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '@/styles/CheckoutPage.module.scss';

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData = {
      customer_name: formData.name,
      customer_phone: formData.phone,
      delivery_address: formData.address,
      order_items: cartItems,
      total_price: totalPrice,
    };

    const { error } = await supabase.from('orders').insert([orderData]);

    if (error) {
      alert('Сталася помилка при оформленні замовлення. Спробуйте ще раз.');
      console.error('Supabase error:', error);
      setIsSubmitting(false);
    } else {
      alert('Дякуємо! Ваше замовлення прийнято.');
      clearCart();
      router.push('/order-success'); // Перенаправляємо на сторінку подяки
    }
  };

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