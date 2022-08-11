import { createClient } from "@supabase/supabase-js";
import { supabaseURL, supabaseKEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const supabase = createClient(supabaseURL, supabaseKEY, {
  localStorage: AsyncStorage as any,
});
