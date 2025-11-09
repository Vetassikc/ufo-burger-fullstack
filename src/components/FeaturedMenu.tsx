// src/components/FeaturedMenu.tsx
"use client";
import Link from 'next/link';
import Image from 'next/image'; 
import styles from '@/styles/FeaturedMenu.module.scss';
import { motion, Variants, useMotionValue, useSpring, useTransform } from 'framer-motion'; // <-- 1. Додаємо хуки framer-motion
import { MouseEvent } from 'react'; // <-- 2. Імпортуємо MouseEvent

// Варіанти анімації для секції (fade-in, slide-up)
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

// --- ▼▼▼ 3. НОВИЙ КОМПОНЕНТ ДЛЯ 3D-КАРТКИ НА ГОЛОВНІЙ СТОРІНЦІ ▼▼▼ ---
interface FeaturedMenuItem {
  id: number; // Додано для унікальності, якщо потрібно
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  altText: string;
}

const AnimatedFeaturedMenuCard = ({ item }: { item: FeaturedMenuItem }) => {
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
        <div className={styles.cardImage}> 
          <Image 
            src={item.imageUrl} 
            alt={item.altText} 
            fill 
            style={{ objectFit: 'cover' }} 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h4 className={styles.cardTitle}>{item.title}</h4>
        <p className={styles.cardDescription}>{item.description}</p>
        <p className={styles.cardPrice}>{item.price}</p>
      </div>
    </motion.div>
  );
};
// --- ▲▲▲ КІНЕЦЬ КОМПОНЕНТА КАРТКИ ▲▲▲ ---

const FeaturedMenu = () => {
  const featuredItems: FeaturedMenuItem[] = [
    {
      id: 1,
      title: "Класичний УФО бургер",
      description: "Соковита яловича котлета, розплавлений сир чеддер та пікантний соус барбекю, запечатані у фірмову булочку.",
      price: "18 CHF",
      imageUrl: "/img/promo-burger.jpeg",
      altText: "Класичний УФО бургер"
    },
    {
      id: 2,
      title: "Корейський УФО бургер",
      description: "Яловича котлета ттокгальбі з пікантним кімчі, тягучою моцарелою та свіжою зеленою цибулею.",
      price: "18 CHF",
      imageUrl: "/img/Bulgogi.jpeg",
      altText: "Корейський УФО бургер"
    },
    {
      id: 3,
      title: "Гострий курячий бургер",
      description: "Надзвичайно гострий соус чилі та справжня смажена курка Чунчхон. Для найсміливіших!",
      price: "18 CHF",
      imageUrl: "/img/Spicychiken.jpeg",
      altText: "Гострий курячий бургер"
    }
  ];

  return (
    <motion.section 
      className={styles.featuredSection}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className={styles.featuredContainer}>
        <h2 className={styles.title}>ХІТИ НАШОГО МЕНЮ</h2>
        <div className={styles.grid}>
          {/* 4. Використовуємо наш новий анімований компонент для кожної картки */}
          {featuredItems.map(item => (
            <AnimatedFeaturedMenuCard key={item.id} item={item} />
          ))}
        </div>
        <div className={styles.ctaContainer}>
          <Link href="/menu" className={styles.ctaButton}>
            Переглянути все меню
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedMenu;