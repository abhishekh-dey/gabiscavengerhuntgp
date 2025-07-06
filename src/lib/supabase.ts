import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Winner {
  id: string;
  name: string;
  department: string;
  unique_key: string;
  riddle_index: number;
  completed_at: string;
}

export interface UsedKey {
  id: string;
  unique_key: string;
  used_at: string;
}

export interface WrongAttempt {
  id: string;
  unique_key: string;
  attempted_at: string;
}