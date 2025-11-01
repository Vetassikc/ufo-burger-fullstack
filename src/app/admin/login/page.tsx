// src/app/admin/login/page.tsx

"use client";
import { useState, useEffect, FormEvent } from 'react'; // Імпортуємо FormEvent
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '@/styles/AuthPage.module.scss'; // Використовуємо ті ж стилі

const AdminLoginPage = () => {
  // 1. Типізуємо state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Перевірка, чи користувач вже увійшов
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/admin'); // Якщо вже є сесія, редірект на дашборд
      }
    };
    checkSession();
  }, [router]);

  // 2. Типізуємо обробник форми
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
      setMessage('Вхід успішний! Перенаправляємо...');
      router.push('/admin'); // Редірект на адмін-панель
    }
    setLoading(false);
  };

  return (
    <main className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>Вхід в Адмін-панель</h1>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Типізація інлайново
            required
            autoComplete="email"
          />
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Типізація інлайново
            required
            autoComplete="current-password"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Входимо...' : 'Увійти'}
          </button>
          {message && <p className={styles.message}>{message}</p>}
        </form>
      </div>
    </main>
  );
};

export default AdminLoginPage;