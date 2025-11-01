// src/app/register/page.tsx

"use client";
import { useState, FormEvent } from 'react'; // Імпортуємо FormEvent
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/AuthPage.module.scss'; // Використовуємо ті ж стилі

const RegisterPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>(''); // Для повідомлень про успіх або помилку
  const [loading, setLoading] = useState<boolean>(false); // Додаємо стан завантаження
  const router = useRouter(); // router не використовується, але залишаємо, якщо знадобиться

  // Типізуємо подію 'e'
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(`Помилка реєстрації: ${error.message}`);
    } else {
      // Supabase за замовчуванням вимагає підтвердження по email
      setMessage('Реєстрація успішна! Будь ласка, перевірте свою пошту, щоб підтвердити акаунт.');
      // Очищуємо поля
      setEmail('');
      setPassword('');
    }
    setLoading(false);
  };

  return (
    // Використовую класи з оригінального файлу register/page.js
    <main className={styles.authContainer}> 
      <div className={styles.authForm}>
        <h1>Створити акаунт</h1>
        <form onSubmit={handleRegister}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            autoComplete="email"
          />
          <input 
            type="password" 
            placeholder="Пароль (мінімум 6 символів)" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            autoComplete="new-password"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Реєструємо...' : 'Зареєструватися'}
          </button>
          {message && <p className={styles.message}>{message}</p>}
        </form>
        <p style={{ marginTop: '20px' }}>
          Вже маєте акаунт? <Link href="/login" style={{ color: 'var(--primary-color)' }}>Увійти</Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;