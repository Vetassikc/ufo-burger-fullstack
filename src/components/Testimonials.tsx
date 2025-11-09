// src/components/Testimonials.tsx
"use client";
import styles from '@/styles/Testimonials.module.scss';
import { motion, Variants } from 'framer-motion';

// Визначаємо варіанти анімації
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut" // <-- ▼▼▼ ОСЬ ВИПРАВЛЕННЯ ▼▼▼
    }
  }
};

const Testimonials = () => {
  return (
    <motion.section 
      className={styles.testimonialsSection}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className={styles.testimonialsContainer}>
        <h2 className={styles.title}>ЩО КАЖУТЬ НАШІ АСТРОНАВТИ</h2>
        <div className={styles.cardsContainer}>
          {/* ... (картки відгуків) ... */}
          <div className={styles.card}>
            <p className={styles.text}>
              &quot;Це найкращий бургер, який я куштував у Цюриху!...&quot;
            </p>
            <p className={styles.author}>- Alex F.</p>
          </div>
          <div className={styles.card}>
            <p className={styles.text}>
              &quot;Замовляли доставку в офіс. Приїхало швидко...&quot;
            </p>
            <p className={styles.author}>- Maria S.</p>
          </div>
          <div className={styles.card}>
            <p className={styles.text}>
              &quot;Дуже приємно підтримувати бізнес із соціальною місією...&quot;
            </p>
            <p className={styles.author}>- Daniel K.</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Testimonials;