"use client";
import { useCart } from "@/context/CartContext";
import styles from "@/styles/CartPage.module.scss";
import Image from "next/image";
import Link from "next/link";

const CartPage = () => {
  const { cartItems, addToCart, decreaseQuantity, removeFromCart, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className={styles.cartSection}>
        <div className={styles.emptyCart}>
          <h2>Ваш кошик порожній</h2>
          <p>Схоже, ви ще не додали жодного космічного бургера.</p>
          <Link href="/menu" className={styles.ctaButton}>
            Перейти до меню
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.cartSection}>
      <div className={styles.cartContainer}>
        <h1 className={styles.pageTitle}>Ваш кошик</h1>
        <div className={styles.cartItems}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.itemImage}>
                {item.image_url && <Image src={item.image_url} alt={item.name} width={80} height={80} />}
              </div>
              <div className={styles.itemDetails}>
                <h4>{item.name}</h4>
                <p>{item.price} CHF</p>
              </div>
              <div className={styles.itemQuantity}>
                <button onClick={() => decreaseQuantity(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => addToCart(item)}>+</button>
              </div>
              <div className={styles.itemTotal}>
                <p>{(item.price * item.quantity).toFixed(2)} CHF</p>
              </div>
              <div className={styles.itemRemove}>
                <button onClick={() => removeFromCart(item.id)}>&times;</button>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.cartSummary}>
          <h2>Всього: {totalPrice.toFixed(2)} CHF</h2>
          <Link href="/checkout" className={styles.ctaButton}>Оформити замовлення</Link>
        </div>
      </div>
    </main>
  );
};

export default CartPage;