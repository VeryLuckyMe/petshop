import { supabase } from '../../../supabaseClient';

export const ProductsModel = {
  async getAllProducts() {
    return await supabase.from('products').select('*');
  },
  async getSession() {
    return await supabase.auth.getSession();
  },
  async logRecentlyViewed(userId, productId) {
    return await supabase
      .from('recently_viewed')
      .upsert({ user_id: userId, product_id: productId, viewed_at: new Date().toISOString() });
  }
};
