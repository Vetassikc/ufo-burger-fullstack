// src/app/login/page.tsx

"use client";

import { useState, FormEvent } from 'react'; // Імпортуємо FormEvent
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import styles from '@/styles/AuthPage.module.scss'; // Використовуємо alias @/
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Типізуємо подію 'e'
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Помилка входу: ${error.message}`);
    } else {
      setMessage('Вхід виконано успішно! Перенаправляємо...');
      // Перенаправляємо на сторінку профілю після успішного входу
      router.push('/profile');
    }
    setLoading(false);
  };

  return (
    <main className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Вхід</h1>
        <p>Увійдіть у свій акаунт, щоб побачити профіль та історію замовлень.</p>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Типізація інлайново
            required
            placeholder="example@mail.com"
          />
          
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Типізація інлайново
            required
            placeholder="Ваш пароль"
          />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Входимо...' : 'Увійти'}
          </button>
          
          {message && <p className={styles.message}>{message}</p>}
        </form>
        <div className={styles.links}>
          <p>
            Немає акаунту? <Link href="/register">Зареєструватися</Link>
          </p>
          <p>
            Забули пароль? {/* Посилання на відновлення паролю (якщо буде) */}
            <Link href="/reset-password">Відновити пароль</Link> 
            {/* Припустимо, що така сторінка є або буде */}
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;