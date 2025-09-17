// src/app/profile/page.js

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; // <-- Правильний шлях через @
import styles from "./ProfilePage.module.scss"; // <-- Правильний шлях

export default function ProfilePage() {
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("points")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Помилка отримання профілю:", error);
        } else if (profile) {
          setPoints(profile.points);
        }
      } else {
        router.push("/login");
      }
      
      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) {
    return <div className={styles.container}><p>Завантаження даних профілю...</p></div>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className={styles.container}>
      <h1>Ваш профіль</h1>
      <p>Вітаємо, {user.email}!</p>
      <div className={styles.pointsCard}>
        <h2>Ваш баланс балів</h2>
        <p className={styles.pointsValue}>{points ?? 0}</p>
      </div>
    </main>
  );
}