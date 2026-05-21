import { supabase } from '../../../supabaseClient';

export const ProfileModel = {
  async getProfile(email) {
    return await supabase.from('zootopiaDatabase').select('*').eq('email', email).single();
  },
  async getAppointments(email) {
    return await supabase.from('appointments').select('*').eq('user_email', email).order('created_at', { ascending: false });
  },
  async updateProfile(email, data) {
    return await supabase.from('zootopiaDatabase').update(data).eq('email', email);
  },
  async updateAuthUser(data) {
    return await supabase.auth.updateUser(data);
  },
  async updateAvatar(email, url) {
    return await supabase.from('zootopiaDatabase').update({ avatar_url: url }).eq('email', email);
  },
  async uploadAvatarStorage(filePath, file) {
    return await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
  },
  getPublicUrl(filePath) {
    return supabase.storage.from('avatars').getPublicUrl(filePath);
  },
  async getSession() {
    return await supabase.auth.getSession();
  },
  onAuthChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
