// src/app/menu/page.tsx
"use client";

import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import styles from '@/styles/MenuPage.module.scss';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import MenuCardSkeleton from '@/components/MenuCardSkeleton'; // <-- ІМПОРТ СКЕЛЕТОНУ

// 1. Інтерфейс для елемента меню
interface MenuItem {
  id: number;
  created_at: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
}

// 2. Компонент 3D-картки
// (Він був у вашому оригінальному файлі, але я включу його сюди для повноти)
const AnimatedMenuCard = ({ item, handleAddToCart }: { item: MenuItem, handleAddToCart: (item: MenuItem) => void }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      className={styles.card}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      <div style={{ transform: 'translateZ(20px)' }}>
        {item.image_url ? (
          <div className={styles.cardImage}>
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              // @ts-ignore
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

// 3. Основний компонент сторінки
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
        setIsLoading(false); // Зупиняємо завантаження при помилці
      } else {
        // (Штучна затримка для демонстрації скелетону)
        // У робочій версії '1000' можна замінити на '0' або прибрати setTimeout
        setTimeout(() => {
          setMenuItems(data);
          setIsLoading(false);
        }, 1000); 
      }
    };
    fetchMenu();
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      ...item,
      id: item.id.toString(),
      quantity: 1
    });
  };

  const ufoBurgers = menuItems.filter(item => item.category === 'ufo');
  const smashBurgers = menuItems.filter(item => item.category === 'smash');
  const sides = menuItems.filter(item => item.category === 'side');

  const renderCard = (item: MenuItem) => (
    <AnimatedMenuCard
      key={item.id}
      item={item}
      handleAddToCart={handleAddToCart}
    />
  );

  // Функція рендерингу контенту (з логікою скелетону)
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <h2 className={styles.categoryTitle}>UFO-Бургери</h2>
          <div className={styles.grid}>
            {[...Array(3)].map((_, i) => <MenuCardSkeleton key={`ufo-skel-${i}`} />)}
          </div>
          <h2 className={styles.categoryTitle}>Смашбургери</h2>
          <div className={styles.grid}>
            {[...Array(3)].map((_, i) => <MenuCardSkeleton key={`smash-skel-${i}`} />)}
          </div>
          <h2 className={styles.categoryTitle}>Додатки та напої</h2>
            <div className={styles.grid}>
            {[...Array(3)].map((_, i) => <MenuCardSkeleton key={`side-skel-${i}`} />)}
          </div>
        </>
      );
    }

    if (error) return <p className={styles.errorText}>Не вдалося завантажити меню: {error}</p>;
    if (menuItems.length === 0 && !isLoading) return <p className={styles.loadingText}>Меню порожнє. Скоро ми щось додамо!</p>;

    return (
      <>
        {ufoBurgers.length > 0 && (
          <>
            <h2 className={styles.categoryTitle}>UFO-Бургери</h2>
            <div className={styles.grid}>
              {ufoBurgers.map(renderCard)}
            </div>
          </>
        )}

        {smashBurgers.length > 0 && (
          <>
            <h2 className={styles.categoryTitle}>Смашбургери</h2>
            <div className={styles.grid}>
              {smashBurgers.map(renderCard)}
            </div>
          </>
        )}
        
        {sides.length > 0 && (
          <>
            <h2 className={styles.categoryTitle}>Додатки та напої</h2>
            <div className={styles.grid}>
              {sides.map(renderCard)}
            </div>
          </>
        )}
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