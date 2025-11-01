// src/app/login/page.tsx
"use client";
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import styles from '@/styles/AuthPage.module.scss';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(`Помилка входу: ${error.message}`);
    } else {
      setMessage('Вхід виконано успішно! Перенаправляємо...');
      router.push('/profile');
    }
    setLoading(false);
  };

  // --- ▼▼▼ ВИПРАВЛЕННЯ КЛАСІВ ▼▼▼ ---
  return (
    <main className={styles.authContainer}>
      <div className={styles.authForm}>
        <h1>Вхід</h1>
        <p>Увійдіть у свій акаунт, щоб побачити профіль та історію замовлень.</p>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="example@mail.com" />
          <label htmlFor="password">Пароль</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Ваш пароль" />
          <button type="submit" disabled={loading}>
            {loading ? 'Входимо...' : 'Увійти'}
          </button>
          {message && <p className={styles.error}>{message}</p>}
        </form>
        <div className={styles.links}>
          <p>Немає акаунту? <Link href="/register">Зареєструватися</Link></p>
        </div>
      </div>
    </main>
  );
};
export default LoginPage;