"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '@/styles/AuthPage.module.scss';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Якщо логін успішний, перенаправляємо на майбутню адмін-панель
      router.push('/admin');
    }
  };

  return (
    <main className={styles.authContainer}>
      <div className={styles.authForm}>
        <h1>Вхід в панель адміністратора</h1>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Пароль" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button type="submit">Увійти</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </main>
  );
};

export default LoginPage;