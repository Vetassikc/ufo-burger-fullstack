"use client"; // Залишаємо, бо тут можуть бути інші клієнтські компоненти
import Link from 'next/link';
import styles from '@/styles/Home.module.scss';
import AboutSection from '@/components/AboutSection';
import Testimonials from '@/components/Testimonials';
import FeaturedMenu from '@/components/FeaturedMenu';

export default function HomePage() {
  return (
    <main>
      <section className={styles.hero} style={{backgroundImage: "url('/img/hero-burger.jpg')"}}>
        <div className={styles.heroContent}>
          {/* Повертаємо статичний текст */}
          <h1 className={styles.heroTitle}>СПРОБУЙ МАЙБУТНЄ БУРГЕРІВ</h1>
          <p className={styles.heroSubtitle}>Унікальний смак у космічному форматі. Свіжі інгредієнти, неземне задоволення.</p>
          <Link href="/menu" className={styles.ctaButton}>Замовити зараз</Link>
        </div>
      </section>
      <AboutSection />
      <Testimonials />
      <FeaturedMenu />
    </main>
  );
}