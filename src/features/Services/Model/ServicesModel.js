import { supabase } from '../../../supabaseClient';

export const ServicesModel = {
  async bookAppointment(appointment) {
    return await supabase.from('appointments').insert([appointment]);
  },
  async getSession() {
    return await supabase.auth.getSession();
  }
};
