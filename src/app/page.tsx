// src/app/page.tsx
"use client";
import Link from 'next/link';
import styles from '@/styles/Home.module.scss';
import AboutSection from '@/components/AboutSection';
import Testimonials from '@/components/Testimonials';
import FeaturedMenu from '@/components/FeaturedMenu';
import { motion, Variants } from 'framer-motion'; // <-- 1. Імпортуємо Variants

export default function HomePage() {

  // --- ▼▼▼ 2. Об'єкт анімацій (variants) з ТИПОМ ▼▼▼ ---
  const heroVariants: Variants = { // <-- 3. Додаємо тип Variants
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut", // Тепер TypeScript знає, що це Easing, а не string
        staggerChildren: 0.3 
      }
    }
  };

  const itemVariants: Variants = { // <-- 4. Додаємо тип Variants
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };
  // --- ▲▲▲ Кінець об'єкта анімацій ▲▲▲ ---

  return (
    <>
      <section 
        className={styles.hero} 
        style={{backgroundImage: "url('/img/hero-burger.jpg')"}}
      >
        {/* 5. Обгортаємо heroContent в motion.div */}
        <motion.div 
          className={styles.heroContent}
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className={styles.heroTitle} variants={itemVariants}>
            Космічні бургери, неземний смак!
          </motion.h1>
          <motion.p className={styles.heroSubtitle} variants={itemVariants}>
            Спробуйте наші унікальні бургери та відчуйте смак космосу.
          </motion.p>
          <motion.div variants={itemVariants}> {/* Додаткова обгортка для Link */}
            <Link href="/menu" className={styles.ctaButton}>
              Переглянути меню
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <AboutSection />
      <Testimonials />
      <FeaturedMenu />
    </>
  );
}