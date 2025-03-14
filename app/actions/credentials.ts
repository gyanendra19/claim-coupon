'use server'

import { createClient } from "@supabase/supabase-js";

export async function supabaseClient(){
    const supabaseUrl = process.env.SUPABASE_URL as string;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

    return createClient(supabaseUrl, supabaseAnonKey)
}