/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Environment değişkenlerini güvenli bir şekilde alıyoruz
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase URL veya Anon Key eksik! .env dosyasını kontrol edin.');
}

// Singleton Instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);