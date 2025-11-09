// src/components/AboutSection.tsx
"use client"; 
import Image from 'next/image';
import styles from '@/styles/AboutSection.module.scss';
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

const AboutSection = () => {
  return (
    <motion.section 
      className={styles.aboutSection}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    > 
      <div className={styles.aboutContainer}>
        <div className={styles.imageWrapper}>
          <Image 
            src="/img/Depth 5, Frame 0.jpg" 
            alt="UFO Burger Truck" 
            width={600} 
            height={450} 
            style={{ width: '100%', height: 'auto', borderRadius: '15px' }}
          />
        </div>
        <div className={styles.textWrapper}>
          <h2 className={styles.title}>НАША КОСМІЧНА МІСІЯ</h2>
          <p>
            UFO Burger — це більше, ніж просто бургери. Це концепція...
          </p>
          <p>
            Наша головна місія — підтримка українських біженців...
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;