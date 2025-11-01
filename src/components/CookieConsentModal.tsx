// src/components/CookieConsentModal.tsx

"use client";
// 'useCart' був позначений як непотрібний у .js файлі, тому я його видалив.
import { useState } from 'react';
import styles from '@/styles/CookieModal.module.scss';

// 1. Визначаємо чіткий тип для можливих значень згоди
type ConsentType = 'all' | 'necessary' | 'rejected';

const CookieConsentModal = () => {
    // 2. Явно типізуємо state
    const [isHidden, setIsHidden] = useState<boolean>(false);

    // 3. Типізуємо аргумент 'consentType'
    const handleConsent = (consentType: ConsentType) => {
        // Ми впевнені, що localStorage доступний у "use client"
        localStorage.setItem('cookieConsent', consentType);
        setIsHidden(true);
        // Ми також впевнені, що 'document' доступний
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
                    {/* Викликаємо handleConsent з валідними типами 'ConsentType' */}
                    <button onClick={() => handleConsent('all')} className={styles.cookieBtn}>Прийняти всі</button>
                    <button onClick={() => handleConsent('necessary')} className={`${styles.cookieBtn} ${styles.secondary}`}>Лише необхідні</button>
                    <button onClick={() => handleConsent('rejected')} className={`${styles.cookieBtn} ${styles.secondary}`}>Відхилити</button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsentModal;