// src/app/menu/page.tsx
"use client";

import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import styles from '@/styles/MenuPage.module.scss';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, MouseEvent } from 'react'; // <-- 1. Імпортуємо MouseEvent
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'; // <-- 2. Імпортуємо хуки

// 3. Визначаємо тип для елемента меню
interface MenuItem {
  id: number;
  created_at: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
}

// --- ▼▼▼ 4. НОВИЙ КОМПОНЕНТ ДЛЯ 3D-КАРТКИ ▼▼▼ ---
const AnimatedMenuCard = ({ item, handleAddToCart }: { item: MenuItem, handleAddToCart: (item: MenuItem) => void }) => {
  // Хуки для відстеження позиції миші
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Створюємо "пружинні" (spring) значення, щоб рух був плавним
  const springConfig = { stiffness: 150, damping: 20 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Трансформуємо позицію миші у значення нахилу (rotate)
  // Чим далі миша від центру (0), тим сильніший нахил (до +/- 10 градусів)
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    // Нормалізуємо позицію миші: від -0.5 до 0.5
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    // Повертаємо картку у вихідне положення
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      className={styles.card}
      style={{
        rotateX, // Прив'язуємо 3D-нахил
        rotateY,
        transformStyle: 'preserve-3d', // Вмикаємо 3D-простір
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }} // Легке збільшення при наведенні
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      {/* Додаємо внутрішній елемент, щоб 3D-ефект був кращим */}
      <div style={{ transform: 'translateZ(20px)' }}> 
        {item.image_url ? (
          <div className={styles.cardImage}>
            <Image 
              src={item.image_url} 
              alt={item.name} 
              fill // Використовуємо fill замість layout
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
            <p className={styles.cardPrice}>{item.price.toFixed(2)} CHF</p>
            <button 
              className={styles.addToCartBtn} 
              onClick={() => handleAddToCart(item)}
            >
              В кошик
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
// --- ▲▲▲ КІНЕЦЬ КОМПОНЕНТА КАРТКИ ▲▲▲ ---


export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setMenuItems(data);
      }
      setIsLoading(false);
    };
    fetchMenu();
  }, []);

  // 5. Функція для додавання в кошик
  const handleAddToCart = (item: MenuItem) => {
    addToCart({ 
      ...item, 
      id: item.id.toString(), // Контекст очікує id як string
      quantity: 1 
    });
  };

  const ufoBurgers = menuItems.filter(item => item.category === 'ufo');
  const smashBurgers = menuItems.filter(item => item.category === 'smash');
  const sides = menuItems.filter(item => item.category === 'side');

  // 6. Функція рендерингу (тепер використовує AnimatedMenuCard)
  const renderCard = (item: MenuItem) => (
    <AnimatedMenuCard 
      key={item.id} 
      item={item} 
      handleAddToCart={handleAddToCart} 
    />
  );

  const renderContent = () => {
    if (isLoading) return <p className={styles.loadingText}>Завантажуємо меню...</p>;
    if (error) return <p className={styles.errorText}>Не вдалося завантажити меню: {error}</p>;
    if (menuItems.length === 0) return <p className={styles.loadingText}>Меню порожнє. Скоро ми щось додамо!</p>;

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
          {renderContent()}
        </div>
      </section>
    </main>
  );
}