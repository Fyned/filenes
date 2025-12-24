/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase URL veya Anon Key eksik! .env dosyasını kontrol edin.');
}

// <Database> generic tipini buraya ekleyerek tam type-safety sağlıyoruz
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);