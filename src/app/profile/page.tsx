// src/app/profile/page.tsx

"use client";

import { useEffect, useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import styles from './ProfilePage.module.scss';
import type { User } from '@supabase/supabase-js';

// --- Визначимо типи ---

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  order_count: number | null;
  points: number | null;
  // Додайте інші поля з таблиці profiles, якщо вони є
}

interface LoyaltyProgress {
  text: string;
  progress?: number;
}

// --- Компонент сторінки ---

const ProfilePage = () => {
  const router = useRouter();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState<string>('');

  // --- Функція для розрахунку даних для програми лояльності ---
  const getLoyaltyProgress = (orderCount: number): LoyaltyProgress => {
    if (orderCount === 0) {
      return { text: "Наступне замовлення зі знижкою 10%!" };
    }
    const ordersLeft = 6 - (orderCount % 6);
    if (ordersLeft === 6) { // Це означає, що поточне замовлення було 6-м
        return { text: `Наступне замовлення (№${orderCount + 1}) буде зі знижкою 30%!`, progress: 100 };
    }
    return {
      text: `Залишилось ${ordersLeft} замовлень до знижки 30%`,
      progress: ((6 - ordersLeft) / 6) * 100, // Розраховуємо прогрес у відсотках
    };
  };

  const fetchProfile = useCallback(async (sessionUser: User) => {
    if (!sessionUser) return;
    
    // Типізуємо запит до Supabase
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", sessionUser.id)
      .single<Profile>(); // Вказуємо тип <Profile>

    if (error) {
      console.error("Помилка отримання профілю:", error);
    } else {
      setProfile(data); // data матиме тип Profile | null
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
        await fetchProfile(session.user);
      }
    };
    checkSession();
  }, [router, fetchProfile]);

  // Типізуємо подію 'e'
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Використовуємо 'as Profile' оскільки ми впевнені, що profile не null на цьому етапі
    setProfile({ ...profile, [name]: value } as Profile);
  };

  // Типізуємо подію 'e'
  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    
    if (!user || !profile) return; // Додаткова перевірка

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address,
      })
      .eq('id', user.id);
      
    if (error) {
      setMessage(`Помилка оновлення: ${error.message}`);
    } else {
      setMessage('Профіль успішно оновлено!');
    }
  };

  if (loading || !profile) {
    return <div className={styles.container}><p>Завантаження даних профілю...</p></div>;
  }

  // Використовуємо '?? 0' для безпечної передачі 'number' у функцію
  const loyalty = getLoyaltyProgress(profile.order_count ?? 0);

  return (
    <main className={styles.container}>
      <h1>Ваш профіль</h1>
      {/* user гарантовано не null на цьому етапі завдяки checkSession */}
      <p>Вітаємо, {user!.email}!</p>
      
      <div className={styles.profileGrid}>
        <div className={styles.pointsCard}>
          <h2>Ваш баланс балів</h2>
          <p className={styles.pointsValue}>{profile.points ?? 0}</p>
          <h2>Кількість замовлень</h2>
          <p className={styles.pointsValue}>{profile.order_count ?? 0}</p>

          {/* ▼▼▼ НАШ НОВИЙ БЛОК ПРОГРЕСУ ▼▼▼ */}
          <div className={styles.loyaltyProgress}>
            <h3>Прогрес до знижки</h3>
            <p className={styles.loyaltyText}>{loyalty.text}</p>
            {loyalty.progress !== undefined && (
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${loyalty.progress}%` }}
                ></div>
              </div>
            )}
          </div>
          {/* ▲▲▲ КІНЕЦЬ НОВОГО БЛОКУ ▲▲▲ */}
        </div>

        <form className={styles.profileForm} onSubmit={handleUpdateProfile}>
            {/* ... ваша форма залишається без змін ... */}
            <h2>Ваші дані</h2>
            <label htmlFor="fullName">Повне ім&apos;я</label>
            <input id="fullName" name="full_name" type="text" value={profile.full_name || ''} onChange={handleInputChange} placeholder="Ваше ім'я" />

            <label htmlFor="phone">Номер телефону</label>
            <input id="phone" name="phone" type="tel" value={profile.phone || ''} onChange={handleInputChange} placeholder="+41 12 345 67 89" />
            
            <label htmlFor="address">Адреса доставки</label>
            <input id="address" name="address" type="text" value={profile.address || ''} onChange={handleInputChange} placeholder="Ваша адреса" />
            
            <button type="submit">Зберегти зміни</button>
            {message && <p className={styles.message}>{message}</p>}
        </form>
      </div>
    </main>
  );
};

export default ProfilePage;