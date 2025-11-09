// src/components/FeaturedMenu.tsx
"use client"; // <-- ▼▼▼ ОСЬ ВИПРАВЛЕННЯ ▼▼▼
import Link from 'next/link';
import Image from 'next/image'; // <-- 1. Імпортуємо Image
import styles from '@/styles/FeaturedMenu.module.scss';
import AnimatedSection from './AnimatedSection'; // <-- 2. Імпортуємо AnimatedSection

const FeaturedMenu = () => {
  return (
    // 3. Замінюємо <section> на <AnimatedSection>
    <AnimatedSection className={styles.featuredSection}>
      <div className={styles.featuredContainer}>
        <h2 className={styles.title}>ХІТИ НАШОГО МЕНЮ</h2>
        <div className={styles.grid}>
          
          {/* Картка 1: Замінюємо плейсхолдер */}
          <div className={styles.card}>
            <div className={styles.cardImage}> {/* Додаємо клас-обгортку */}
              <Image src="/img/promo-burger.jpeg" alt="Класичний УФО бургер" layout="fill" objectFit="cover" />
            </div>
            <h4 className={styles.cardTitle}>Класичний УФО бургер</h4>
            <p className={styles.cardDescription}>
              Соковита яловича котлета, розплавлений сир чеддер та пікантний соус барбекю, запечатані у фірмову булочку.
            </p>
            <p className={styles.cardPrice}>18 CHF</p>
          </div>
          
          {/* Картка 2: Замінюємо плейсхолдер */}
          <div className={styles.card}>
             <div className={styles.cardImage}>
              <Image src="/img/Bulgogi.jpeg" alt="Корейський УФО бургер" layout="fill" objectFit="cover" />
            </div>
            <h4 className={styles.cardTitle}>Корейський УФО бургер</h4>
            <p className={styles.cardDescription}>
              Яловича котлета ттокгальбі з пікантним кімчі, тягучою моцарелою та свіжою зеленою цибулею.
            </p>
            <p className={styles.cardPrice}>18 CHF</p>
          </div>
          
          {/* Картка 3: Замінюємо плейсхолдер */}
          <div className={styles.card}>
             <div className={styles.cardImage}>
              <Image src="/img/Spicychiken.jpeg" alt="Гострий курячий бургер" layout="fill" objectFit="cover" />
            </div>
            <h4 className={styles.cardTitle}>Гострий курячий бургер</h4>
            <p className={styles.cardDescription}>
              Надзвичайно гострий соус чилі та справжня смажена курка Чунчхон. Для найсміливіших!
            </p>
            <p className={styles.cardPrice}>18 CHF</p>
          </div>
          
        </div>
        <div className={styles.ctaContainer}>
          <Link href="/menu" className={styles.ctaButton}>
            Переглянути все меню
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default FeaturedMenu;