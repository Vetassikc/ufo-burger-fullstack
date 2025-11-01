// src/components/CookieConsentModal.tsx
"use client";
import { useState, useEffect } from 'react';
import styles from '@/styles/CookieModal.module.scss';

type ConsentType = 'all' | 'necessary' | 'rejected';

const CookieConsentModal = () => {
    // --- ▼▼▼ ВИПРАВЛЕННЯ ГІДРАТАЦІЇ 2 ▼▼▼ ---
    const [isHidden, setIsHidden] = useState<boolean>(true); // 1. Завжди ховаємо на сервері
    const [isClient, setIsClient] = useState<boolean>(false);

    useEffect(() => {
        setIsClient(true); // 2. Встановлюємо, що ми на клієнті
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setIsHidden(false); // 3. Показуємо модалку, якщо згоди немає
        }
    }, []); // Виконується 1 раз на клієнті
    // --- ▲▲▲ КІНЕЦЬ ВИПРАВЛЕННЯ 2 ▲▲▲ ---

    const handleConsent = (consentType: ConsentType) => {
        localStorage.setItem('cookieConsent', consentType);
        setIsHidden(true);
    };

    // 4. Не рендеримо нічого на сервері (isClient=false) або якщо модалка схована
    if (!isClient || isHidden) {
        return null;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Ваша приватність важлива для нас</h3>
                <p>Ми використовуємо cookie-файли для покращення вашого досвіду.</p>
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