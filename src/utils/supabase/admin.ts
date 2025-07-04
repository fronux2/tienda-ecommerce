// lib/supabase-admin.ts
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // ⚠️ Nunca expongas esta en el frontend
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);
