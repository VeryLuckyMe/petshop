import { supabase } from '../../../supabaseClient';

export const AuthModel = {
  async signUp(email, password, metadata) {
    return await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
  },

  async login(email, password) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  async createProfile(profileData) {
    return await supabase.from('zootopiaDatabase').insert([profileData]);
  }
};
