// src/app/checkout/page.js

"use client";
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import styles from '@/styles/CheckoutPage.module.scss';
import PaymentForm from '@/components/PaymentForm';
import { supabase } from '@/lib/supabaseClient';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const POINTS_TO_CHF_RATE = 10;

const CheckoutPage = () => {
  const { cartItems, totalPrice } = useCart();
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [pointsDiscount, setPointsDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(totalPrice);

  useEffect(() => {
    const getUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
          setFormData({
            name: profileData.full_name || '',
            phone: profileData.phone || '',
            address: profileData.address || '',
          });

          const orderCount = profileData.order_count || 0;
          let currentDiscount = 0;
          if (orderCount === 0) {
            currentDiscount = 0.10;
          } else if ((orderCount + 1) % 6 === 0) {
            currentDiscount = 0.30;
          }
          setDiscount(currentDiscount);
        }
      }
    };
    getUserAndProfile();
  }, []);

  useEffect(() => {
    const priceAfterPercentageDiscount = totalPrice * (1 - discount);
    const newFinalPrice = priceAfterPercentageDiscount - pointsDiscount;
    setFinalPrice(newFinalPrice > 0 ? newFinalPrice : 0);
  }, [totalPrice, discount, pointsDiscount]);

  // ▼▼▼ ОСЬ ФУНКЦІЯ, ЯКОЇ НЕ ВИСТАЧАЛО ▼▼▼
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyPoints = () => {
    if (!profile || profile.points <= 0) return;

    const priceAfterPercentageDiscount = totalPrice * (1 - discount);
    const maxPointsAsCHF = Math.floor(profile.points / POINTS_TO_CHF_RATE);
    
    const discountFromPoints = Math.min(maxPointsAsCHF, priceAfterPercentageDiscount);
    const pointsThatWillBeUsed = Math.floor(discountFromPoints * POINTS_TO_CHF_RATE);

    setPointsDiscount(discountFromPoints);
    setPointsToUse(pointsThatWillBeUsed);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const orderData = {
      ...formData,
      order_items: cartItems,
      total_price: finalPrice,
      user_id: user ? user.id : null,
      points_to_use: pointsToUse,
    };

    try {
      const response = await fetch('/api/create-stripe-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Помилка при створенні платіжної сесії.');

      const { clientSecret, orderId } = await response.json();
      
      setClientSecret(clientSecret);
      setOrderId(orderId);
      setIsFormSubmitted(true);
      
    } catch (error) {
      alert(error.message);
      setIsProcessing(false);
    }
  };

  const appearance = { theme: 'dark' };
  const options = { clientSecret, appearance };

  return (
    <main className={styles.checkoutSection}>
      <div className={styles.checkoutContainer}>
        <h1>Оформлення замовлення</h1>
        <div className={styles.grid}>
          <div className={styles.formWrapper}>
            {!isFormSubmitted ? (
              <form onSubmit={handleContactSubmit}>
                <h3>Ваші контактні дані</h3>
                <input type="text" name="name" placeholder="Ім'я та прізвище" required value={formData.name} onChange={handleInputChange} />
                <input type="tel" name="phone" placeholder="Номер телефону" required value={formData.phone} onChange={handleInputChange} />
                <input type="text" name="address" placeholder="Адреса доставки" required value={formData.address} onChange={handleInputChange} />
                <button type="submit" disabled={isProcessing || cartItems.length === 0}>
                  {isProcessing ? 'Обробка...' : 'Перейти до оплати'}
                </button>
              </form>
            ) : (
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
            {discount > 0 && (
              <div className={`${styles.summaryItem} ${styles.discount}`}>
                <strong>Знижка за лояльність:</strong>
                <strong>-{(discount * 100).toFixed(0)}%</strong>
              </div>
            )}
            
            {profile && profile.points > 0 && !isFormSubmitted && (
              <div className={styles.pointsSection}>
                <p>У вас є {profile.points} балів.</p>
                <button type="button" onClick={handleApplyPoints} disabled={pointsDiscount > 0}>
                  {pointsDiscount > 0 ? `Застосовано -${pointsDiscount.toFixed(2)} CHF` : "Використати бали"}
                </button>
              </div>
            )}

            {pointsDiscount > 0 && (
                 <div className={`${styles.summaryItem} ${styles.discount}`}>
                    <strong>Знижка за бали:</strong>
                    <strong>-{pointsDiscount.toFixed(2)} CHF</strong>
                </div>
            )}
            
            <div className={styles.summaryTotal}>
              <strong>До сплати:</strong>
              <strong>{finalPrice.toFixed(2)} CHF</strong>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;