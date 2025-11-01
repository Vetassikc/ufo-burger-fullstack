// src/components/ContactModal.tsx
"use client";
import React from 'react';
import styles from '@/styles/ContactModal.module.scss'; //

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal = ({ onClose }: ContactModalProps) => {
  
  // Зупиняємо клік, щоб модалка не закрилась по кліку на собі
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h3>Напишіть нам</h3>
        <p>Маєте питання чи пропозиції? Будемо раді їх почути!</p>
        <form action="https://formspree.io/f/movwlrez" method="POST">
          <input type="text" name="name" placeholder="Ваше ім'я" required autoComplete="name" />
          <input type="email" name="email" placeholder="Ваш Email" required autoComplete="email" />
          <textarea name="message" rows={5} placeholder="Ваше повідомлення..." required autoComplete="off"></textarea>
          <button type="submit" className={styles.formButton}>Відправити</button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;