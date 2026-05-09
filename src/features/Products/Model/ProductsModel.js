import { supabase } from '../../../supabaseClient';

export const ProductsModel = {
  async getAllProducts() {
    return await supabase.from('products').select('*');
  },
  async getSession() {
    return await supabase.auth.getSession();
  }
};
