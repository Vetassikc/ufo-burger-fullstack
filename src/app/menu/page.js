"use client"; // Перетворюємо на клієнтський компонент

import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import styles from '@/styles/MenuPage.module.scss';
import { useCart } from '@/context/CartContext'; // <-- ІМПОРТУЄМО ХУК КОШИКА
import { useState, useEffect } from 'react';

// Компонент тепер не асинхронний, дані завантажуємо через useEffect
export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const { addToCart } = useCart(); // Отримуємо функцію addToCart з контексту

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching menu items:', error);
      } else {
        setMenuItems(data);
      }
    };
    fetchMenu();
  }, []);

  const ufoBurgers = menuItems?.filter(item => item.category === 'ufo') || [];
  const smashBurgers = menuItems?.filter(item => item.category === 'smash') || [];
  const sides = menuItems?.filter(item => item.category === 'side') || [];

  const renderCard = (item) => (
    <div key={item.id} className={styles.card}>
      {item.image_url ? ( <div className={styles.cardImage}> <Image src={item.image_url} alt={item.name} layout="fill" objectFit="cover" /> </div>) : (<div className={styles.cardImagePlaceholder}></div>)}
      <div className={styles.cardContent}>
        <h4 className={styles.cardTitle}>{item.name}</h4>
        <p className={styles.cardDescription}>{item.description}</p>
        <div className={styles.cardFooter}>
          <p className={styles.cardPrice}>{item.price} CHF</p>
          {/* ДОДАЄМО КНОПКУ */}
          <button className={styles.addToCartBtn} onClick={() => addToCart(item)}>В кошик</button>
        </div>
      </div>
    </div>
  );
  // ... решта коду компонента ...
  return (
    <main>
        <section className={styles.menuSection}>
            <div className={styles.menuContainer}>
                <h1 className={styles.pageTitle}>НАШЕ КОСМІЧНЕ МЕНЮ</h1>
                <p className={styles.pageIntro}>Ми пишаємося тим, що використовуємо свіжі продукти, співпрацюючи з локальними швейцарськими постачальниками, щоб кожен бургер був не тільки смачним, але і якісним.</p>

                <h2 className={styles.categoryTitle}>UFO-Бургери</h2>
                <div className={styles.grid}>
                    {ufoBurgers.map(renderCard)}
                </div>

                <h2 className={styles.categoryTitle}>Смашбургери</h2>
                <div className={styles.grid}>
                    {smashBurgers.map(renderCard)}
                </div>

                <h2 className={styles.categoryTitle}>Додатки та напої</h2>
                <div className={styles.grid}>
                    {sides.map(renderCard)}
                </div>
            </div>
        </section>
    </main>
  )
}