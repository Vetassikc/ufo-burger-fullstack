// src/components/CookieConsentModal.tsx
"use client";
import { useState, useEffect } from 'react'; // <-- Імпортуємо useEffect
import styles from '@/styles/CookieModal.module.scss';

type ConsentType = 'all' | 'necessary' | 'rejected';

const CookieConsentModal = () => {
    // 1. Початковий стан ЗАВЖДИ "сховано"
    const [isHidden, setIsHidden] = useState<boolean>(true);
    // 2. Додаємо стан, щоб відстежити, чи це клієнт
    const [isClient, setIsClient] = useState<boolean>(false);

    // 3. Цей ефект виконається ТІЛЬКИ на клієнті
    useEffect(() => {
        setIsClient(true); // Тепер ми знаємо, що це клієнт
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            // Якщо згоди НЕМАЄ, показуємо модалку
            setIsHidden(false); 
        }
    }, []); // Порожній масив = виконати один раз при завантаженні

    const handleConsent = (consentType: ConsentType) => {
        localStorage.setItem('cookieConsent', consentType);
        setIsHidden(true);
        document.body.classList.remove('modal-open');
    };

    // 4. Якщо ми на сервері (isClient === false) АБО якщо модалка має бути схована - нічого не рендеримо
    if (!isClient || isHidden) {
        return null;
    }

    // Рендеримо модалку, лише якщо це клієнт І згоди ще немає
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