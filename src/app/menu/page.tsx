"use client"; // Компонент залишається клієнтським, оскільки використовує хуки

import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import styles from '@/styles/MenuPage.module.scss';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

// 1. Визначаємо тип для елемента меню (головна перевага TypeScript)
interface MenuItem {
  id: number;
  created_at: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
}

export default function MenuPage() {
  // 2. Додаємо типізацію для стану та нові стани для завантаження і помилок
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Стан завантаження
  const [error, setError] = useState<string | null>(null); // Стан помилки
  
  const { addToCart } = useCart(); // Отримуємо функцію addToCart з контексту

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true); // Починаємо завантаження
      setError(null);

      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching menu items:', error);
        setError(error.message); // Зберігаємо повідомлення про помилку
      } else {
        setMenuItems(data);
      }
      
      setIsLoading(false); // Завершуємо завантаження
    };
    fetchMenu();
  }, []);

  // 3. Фільтрація залишається такою ж
  const ufoBurgers = menuItems.filter(item => item.category === 'ufo');
  const smashBurgers = menuItems.filter(item => item.category === 'smash');
  const sides = menuItems.filter(item => item.category === 'side');

  // 4. Додаємо тип для 'item' у функції
  const renderCard = (item: MenuItem) => (
    <div key={item.id} className={styles.card}>
      {/* Переконайтеся, що для 'layout="fill"' батьківський елемент 
        (styles.cardImage) має 'position: relative' у SCSS
      */}
      {item.image_url ? (
        <div className={styles.cardImage}>
          <Image 
            src={item.image_url} 
            alt={item.name} 
            layout="fill" 
            objectFit="cover" 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className={styles.cardImagePlaceholder}></div>
      )}
      <div className={styles.cardContent}>
        <h4 className={styles.cardTitle}>{item.name}</h4>
        <p className={styles.cardDescription}>{item.description}</p>
        <div className={styles.cardFooter}>
          <p className={styles.cardPrice}>{item.price} CHF</p>
          <button 
            className={styles.addToCartBtn} 
            onClick={() => addToCart({ ...item, id: item.id.toString(), quantity: 1 })}
          >
            В кошик
          </button>
        </div>
      </div>
    </div>
  );

  // 5. Додаємо відображення станів завантаження та помилок
  const renderContent = () => {
    if (isLoading) {
      return <p className={styles.loadingText}>Завантажуємо меню...</p>;
    }

    if (error) {
      return <p className={styles.errorText}>Не вдалося завантажити меню: {error}</p>;
    }

    if (menuItems.length === 0) {
      return <p className={styles.loadingText}>Меню порожнє. Скоро ми щось додамо!</p>;
    }

    return (
      <>
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
      </>
    );
  };

  return (
    <main>
      <section className={styles.menuSection}>
        <div className={styles.menuContainer}>
          <h1 className={styles.pageTitle}>НАШЕ КОСМІЧНЕ МЕНЮ</h1>
          <p className={styles.pageIntro}>
            Ми пишаємося тим, що використовуємо свіжі продукти, співпрацюючи з локальними швейцарськими постачальниками, щоб кожен бургер був не тільки смачним, але і якісним.
          </p>
          
          {/* Рендеримо контент залежно від стану */}
          {renderContent()}

        </div>
      </section>
    </main>
  );
}