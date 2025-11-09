// src/components/MenuCardSkeleton.tsx
import styles from '@/styles/MenuCardSkeleton.module.scss';

const MenuCardSkeleton = () => {
  return (
    <div className={styles.card}>
      <div className={styles.placeholder}></div>
      <div className={styles.content}>
        <div className={styles.title}></div>
        <div className={styles.description}></div>
        <div className={styles.descriptionHalf}></div>
        <div className={styles.footer}>
          <div className={styles.price}></div>
          <div className={styles.button}></div>
        </div>
      </div>
    </div>
  );
};

export default MenuCardSkeleton;