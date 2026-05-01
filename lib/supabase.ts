import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Crée et exporte le client Supabase pour une utilisation côté client et serveur
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
