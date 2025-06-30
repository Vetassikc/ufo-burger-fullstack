import Link from 'next/link';
import styles from '@/styles/FeaturedMenu.module.scss';

const FeaturedMenu = () => {
  return (
    <section className={styles.featuredSection}>
      <div className={styles.featuredContainer}>
        <h2 className={styles.title}>ХІТИ НАШОГО МЕНЮ</h2>
        <div className={styles.grid}>
          {/* Картка 1 */}
          <div className={styles.card}>
            <div className={styles.cardImagePlaceholder}></div>
            <h4 className={styles.cardTitle}>Класичний УФО бургер</h4>
            <p className={styles.cardDescription}>
              Соковита яловича котлета, розплавлений сир чеддер та пікантний соус барбекю, запечатані у фірмову булочку.
            </p>
            <p className={styles.cardPrice}>18 CHF</p>
          </div>
          {/* Картка 2 */}
          <div className={styles.card}>
            <div className={styles.cardImagePlaceholder}></div>
            <h4 className={styles.cardTitle}>Корейський УФО бургер</h4>
            <p className={styles.cardDescription}>
              Яловича котлета ттокгальбі з пікантним кімчі, тягучою моцарелою та свіжою зеленою цибулею.
            </p>
            <p className={styles.cardPrice}>18 CHF</p>
          </div>
          {/* Картка 3 */}
          <div className={styles.card}>
            <div className={styles.cardImagePlaceholder}></div>
            <h4 className={styles.cardTitle}>Класичний смашбургер</h4>
            <p className={styles.cardDescription}>
              Дві тонкі яловичі котлети з хрусткою скоринкою, подвійний сир чеддер, свіжий салат та фірмовий соус.
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
    </section>
  );
};

export default FeaturedMenu;