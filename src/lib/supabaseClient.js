import { createClient } from '@supabase/supabase-js'

// Отримуємо наші змінні з файлу .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Створюємо та експортуємо єдиний екземпляр клієнта Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)