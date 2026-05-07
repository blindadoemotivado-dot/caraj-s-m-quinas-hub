import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://sifiesadpbbypdovvixe.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_0ID3vhpoe1NYSpIwvvwsmQ_ve5sh4-c";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Machine = {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  category_id: string | null;
  year: number | null;
  power: string | null;
  weight: string | null;
  capacity: string | null;
  description: string | null;
  applications: string | null;
  main_image_url: string | null;
  gallery_urls: string[] | null;
  pdf_url: string | null;
  is_featured: boolean;
  view_count: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  category?: Category | null;
};

export const WHATSAPP_NUMBER = "5594991306843";
