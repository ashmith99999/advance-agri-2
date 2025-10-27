import { createClient } from '@supabase/supabase-js';

// --- IMPORTANT ---
// The credentials below have been hardcoded to resolve the blank screen error
// as you requested. In a real-world application, this is a major security risk.
// You should always use your platform's "Secrets" manager for sensitive keys.
const supabaseUrl = 'https://iluyimrvrvlxrgvyuops.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsdXlpbXJ2cnZseHJndnl1b3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2ODAxMTQsImV4cCI6MjA3NTI1NjExNH0.18pDb1RMS5PIPl_0exI0O8zGlweTVu4o0qjOTVToons';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);