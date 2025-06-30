"use client";
import { useCart } from '@/context/CartContext'; // Ми можемо використовувати useCart, але він тут не потрібен
import { useState } from 'react';
import styles from '@/styles/CookieModal.module.scss'; // Створимо цей файл стилів

const CookieConsentModal = () => {
    const [isHidden, setIsHidden] = useState(false);

    const handleConsent = (consentType) => {
        localStorage.setItem('cookieConsent', consentType);
        setIsHidden(true);
        document.body.classList.remove('modal-open');
    };

    // Якщо користувач вже натиснув кнопку, не рендеримо нічого
    if(isHidden) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Ваша приватність важлива для нас</h3>
                <p>Ми використовуємо cookie-файли для покращення вашого досвіду. Ви можете прийняти всі cookie або лише ті, що необхідні для роботи сайту.</p>
                <div className={styles.cookieBtnGroup}>
                    <button onClick={() => handleConsent('all')} className={styles.cookieBtn}>Прийняти всі</button>
                    <button onClick={() => handleConsent('necessary')} className={`${styles.cookieBtn} ${styles.secondary}`}>Лише необхідні</button>
                    <button onClick={() => handleConsent('rejected')} className={`${styles.cookieBtn} ${styles.secondary}`}>Відхилити</button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsentModal;