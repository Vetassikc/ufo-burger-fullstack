// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

// TypeScript вимагає, щоб ми чітко вказали, що ці змінні є рядками (string)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Створюємо та експортуємо єдиний екземпляр клієнта Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);