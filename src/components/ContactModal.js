"use client";
import styles from '@/styles/ContactModal.module.scss';

// Компонент приймає функцію `onClose` для свого закриття
const ContactModal = ({ onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h3>Напишіть нам</h3>
        <p>Маєте питання чи пропозиції? Будемо раді їх почути!</p>
        <form action="https://formspree.io/f/movwlrez" method="POST">
          <input type="text" name="name" placeholder="Ваше ім'я" required autoComplete="name" />
          <input type="email" name="email" placeholder="Ваш Email" required autoComplete="email" />
          <textarea name="message" rows="5" placeholder="Ваше повідомлення..." required autoComplete="off"></textarea>
          <button type="submit" className={styles.formButton}>Відправити</button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;