import { supabase } from '../../../supabaseClient';

export const AboutModel = {
  async getSession() {
    return await supabase.auth.getSession();
  }
};
