import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import styles from '@/styles/GalleryPage.module.scss';

async function GalleryPage() {
  // Завантажуємо тільки ті товари, для яких є зображення
  const { data: itemsWithImages, error } = await supabase
    .from('menu_items')
    .select('name, image_url')
    .not('image_url', 'is', null); // Вибираємо тільки рядки, де image_url не порожнє

  if (error) {
    console.error("Error fetching images for gallery:", error);
  }

  return (
    <main>
      <section className={styles.gallerySection}>
        <div className={styles.galleryContainer}>
          <h1 className={styles.pageTitle}>Галерея</h1>
          <p className={styles.pageIntro}>Зануртеся в атмосферу UFO Burger та подивіться на наші космічні страви!</p>
          <div className={styles.grid}>
            {itemsWithImages && itemsWithImages.map((item) => (
              <div key={item.name} className={styles.gridItem}>
                <Image src={item.image_url} alt={item.name} width={500} height={500} style={{ objectFit: 'cover' }}/>
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