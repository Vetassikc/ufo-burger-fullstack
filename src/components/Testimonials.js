import styles from '@/styles/Testimonials.module.scss';

const Testimonials = () => {
  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.testimonialsContainer}>
        <h2 className={styles.title}>ЩО КАЖУТЬ НАШІ АСТРОНАВТИ</h2>
        <div className={styles.cardsContainer}>
          {/* Відгук 1 */}
          <div className={styles.card}>
            <p className={styles.text}>
              {'"Це найкращий бургер, який я куштував у Цюриху! Формат UFO — просто геній, нічого не вивалюється. Смак космічний!"'}
            </p>
            <p className={styles.author}>{'- Alex F.'}</p>
          </div>
          {/* Відгук 2 */}
          <div className={styles.card}>
            <p className={styles.text}>
              {'"Замовляли доставку в офіс. Приїхало швидко, все було гарячим і ідеально запакованим. Галактична картопля — це любов. 10/10!"'}
            </p>
            <p className={styles.author}>{'- Maria S.'}</p>
          </div>
          {/* Відгук 3 */}
          <div className={styles.card}>
            <p className={styles.text}>
              {'"Дуже приємно підтримувати бізнес із соціальною місією. А коли це ще й так смачно, то це подвійне задоволення.'"}
            </p>
            <p className={styles.author}>{'- Daniel K.'}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;