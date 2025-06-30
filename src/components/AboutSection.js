import Image from 'next/image';
import styles from '@/styles/AboutSection.module.scss';

const AboutSection = () => {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.aboutContainer}>
        <div className={styles.imageWrapper}>
          {/* Покладіть ваше зображення, наприклад 'about-burger.jpg', у папку public/img/ */}
          {/* Якщо у вас поки немає папки public, створіть її в корені проєкту */}
          {/* <Image src="/img/about-burger.jpg" alt="UFO Burger Story" width={500} height={500} layout="responsive" /> */}
          <div className={styles.imagePlaceholder}></div>
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
    </section>
  );
};

export default AboutSection;