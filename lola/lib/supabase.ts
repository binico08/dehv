import "react-native-url-polyfill/auto";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qrrocbeqhpyuusdrrazg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFycm9jYmVxaHB5dXVzZHJyYXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMTIzNTUsImV4cCI6MjA1Njg4ODM1NX0.BLMk38PkNl-U79i3SD5IzoixypOzMQ-N8trC_Avgzkc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})