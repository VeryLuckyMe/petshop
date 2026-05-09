import { supabase } from '../../../supabaseClient';

export const DashboardModel = {
  async getProducts() {
    return await supabase.from('products').select('*');
  },
  async bookAppointment(appointment) {
    return await supabase.from('appointments').insert([appointment]);
  },
  async getSession() {
    return await supabase.auth.getSession();
  },
  onAuthChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
