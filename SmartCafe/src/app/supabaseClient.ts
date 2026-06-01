import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

const supabaseUrl = `https://${projectId}.supabase.co`;

// Client for realtime subscriptions (uses public anon key)
export const supabase = createClient(supabaseUrl, publicAnonKey);

// Base URL for all Edge Function API calls
export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/server`;
