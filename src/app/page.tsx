// src/app/page.tsx

"use client";
import Link from 'next/link';
import styles from '@/styles/Home.module.scss';
import AboutSection from '@/components/AboutSection';
import Testimonials from '@/components/Testimonials';
import FeaturedMenu from '@/components/FeaturedMenu';

export default function HomePage() {
  return (
    // Використовуємо Fragment (<>), оскільки <main> вже є в MainLayout.tsx
    <>
      {/* Ця структура тепер правильна. 
        <section className={styles.hero}> має ОДИН дочірній елемент,
        який 'display: flex' і 'justify-content: center' ідеально відцентрують.
      */}
      <section 
        className={styles.hero} 
        style={{backgroundImage: "url('/img/hero-burger.jpg')"}}
      >
        <div className={styles.heroContent}>
          {/* Ви можете використовувати цей текст або той, що був у вашому page.js */}
          <h1 className={styles.heroTitle}>Космічні бургери, неземний смак!</h1>
          <p className={styles.heroSubtitle}>Спробуйте наші унікальні бургери та відчуйте смак космосу.</p>
          <Link href="/menu" className={styles.ctaButton}>Переглянути меню</Link>
        </div>
      </section>

      {/* Інші компоненти */}
      <AboutSection />
      <Testimonials />
      <FeaturedMenu />
    </>
  );
}