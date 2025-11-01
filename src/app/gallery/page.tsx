// src/app/gallery/page.tsx

import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import styles from '@/styles/GalleryPage.module.scss';
import React from 'react'; // Додаємо імпорт React

// 1. Визначаємо тип даних, які ми очікуємо
interface GalleryItem {
  name: string;
  image_url: string; // Ми знаємо, що це string, оскільки фільтруємо null
}

async function GalleryPage() {
  // 2. Типізуємо відповідь від Supabase
  const { data: itemsWithImages, error } = await supabase
    .from('menu_items')
    .select('name, image_url')
    .not('image_url', 'is', null) // Вибираємо тільки рядки, де image_url не порожнє
    .returns<GalleryItem[]>(); // <-- Вказуємо очікуваний тип

  if (error) {
    console.error("Error fetching images for gallery:", error);
    // Можна додати компонент помилки для користувача
  }

  return (
    <main>
      <section className={styles.gallerySection}>
        <div className={styles.galleryContainer}>
          <h1 className={styles.pageTitle}>Галерея</h1>
          <p className={styles.pageIntro}>Зануртеся в атмосферу UFO Burger та подивіться на наші космічні страви!</p>
          <div className={styles.grid}>
            {/* 3. 'item' тепер автоматично має тип GalleryItem */}
            {itemsWithImages && itemsWithImages.map((item) => (
              <div key={item.name} className={styles.gridItem}>
                <Image 
                  src={item.image_url} 
                  alt={item.name} 
                  width={500} 
                  height={500} 
                  style={{ objectFit: 'cover' }}
                />
                <div className={styles.caption}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default GalleryPage;