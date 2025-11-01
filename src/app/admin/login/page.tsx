// src/app/admin/login/page.tsx
"use client";
import { useState, useEffect, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '@/styles/AuthPage.module.scss';

const AdminLoginPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/admin'); 
      }
    };
    checkSession();
  }, [router]);

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
      router.push('/admin'); 
    }
    setLoading(false);
  };

  // --- ▼▼▼ ВИПРАВЛЕННЯ КЛАСІВ ▼▼▼ ---
  return (
    <main className={styles.authContainer}> 
      <div className={styles.authForm}>
        <h1>Вхід в Адмін-панель</h1>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Входимо...' : 'Увійти'}
          </button>
          {message && <p className={styles.error}>{message}</p>} 
        </form>
      </div>
    </main>
  );
};

export default AdminLoginPage;