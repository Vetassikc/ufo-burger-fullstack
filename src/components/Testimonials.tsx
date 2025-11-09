// src/components/Testimonials.tsx

import styles from '@/styles/Testimonials.module.scss';
import AnimatedSection from './AnimatedSection'; // <-- 1. Імпортуємо

const Testimonials = () => {
  return (
    // 2. Замінюємо <section> на <AnimatedSection>
    <AnimatedSection className={styles.testimonialsSection}>
      <div className={styles.testimonialsContainer}>
        <h2 className={styles.title}>ЩО КАЖУТЬ НАШІ АСТРОНАВТИ</h2>
        <div className={styles.cardsContainer}>
          {/* ... (вміст карток залишається без змін) ... */}
          <div className={styles.card}>
            <p className={styles.text}>
              &quot;Це найкращий бургер, який я куштував у Цюриху! Формат UFO — просто геній, нічого не вивалюється. Смак космічний!&quot;
            </p>
            <p className={styles.author}>- Alex F.</p>
          </div>
          <div className={styles.card}>
            <p className={styles.text}>
              &quot;Замовляли доставку в офіс. Приїхало швидко, все було гарячим і ідеально запакованим. Галактична картопля — це любов. 10/10!&quot;
            </p>
            <p className={styles.author}>- Maria S.</p>
          </div>
          <div className={styles.card}>
            <p className={styles.text}>
              &quot;Дуже приємно підтримувати бізнес із соціальною місією. А коли це ще й так смачно, то це подвійне задоволення.&quot;
            </p>
            <p className={styles.author}>- Daniel K.</p>
          </div>
        </div>
      </div>
    </AnimatedSection> // 2. Закриваємо AnimatedSection
  );
};

export default Testimonials;