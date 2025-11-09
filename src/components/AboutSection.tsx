// src/components/AboutSection.tsx

import Image from 'next/image';
import styles from '@/styles/AboutSection.module.scss';
import AnimatedSection from './AnimatedSection'; // <-- 1. Імпортуємо

const AboutSection = () => {
  return (
    // 2. Замінюємо <section> на <AnimatedSection>
    <AnimatedSection className={styles.aboutSection}> 
      <div className={styles.aboutContainer}>
        <div className={styles.imageWrapper}>
          <Image 
            src="/img/Depth 5, Frame 0.jpg" // <-- 3. Додаємо реальне зображення
            alt="UFO Burger Truck" 
            width={600} 
            height={450} 
            style={{ width: '100%', height: 'auto', borderRadius: '15px' }}
          />
        </div>
        <div className={styles.textWrapper}>
          <h2 className={styles.title}>НАША КОСМІЧНА МІСІЯ</h2>
          <p>
            UFO Burger — це більше, ніж просто бургери. Це концепція, що поєднує футуристичний смак та соціальну відповідальність. Ми використовуємо свіжі інгредієнти від локальних швейцарських постачальників, щоб гарантувати найвищу якість.
          </p>
          <p>
            Наша головна місія — підтримка українських біженців через працевлаштування та допомога в інтеграції. Кожен ваш бургер — це внесок у цю важливу справу.
          </p>
        </div>
      </div>
    </AnimatedSection> // 2. Закриваємо AnimatedSection
  );
};

export default AboutSection;