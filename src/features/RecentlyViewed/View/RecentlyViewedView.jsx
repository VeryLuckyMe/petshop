import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { supabase } from '../../../../src/supabaseClient';

function RecentlyViewedView() {
  const navigate = useNavigate();
  const [recentProducts, setRecentProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        try {
          const { data, error } = await supabase
            .from('recently_viewed')
            .select('product_id, viewed_at, products(*)')
            .eq('user_id', session.user.id)
            .order('viewed_at', { ascending: false })
            .limit(10);
            
          if (!error && data) {
            const products = data.map(item => ({
              ...item.products,
              image: item.products.image_url,
              viewed_at: item.viewed_at
            })).filter(p => p.id); // ensure valid product
            setRecentProducts(products);
          }
        } catch (err) {
          console.error('Fetch recently viewed error:', err);
        }
      }
      setLoading(false);
    };

    fetchRecentlyViewed();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 font-display">
      <Navbar user={user} />
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-4xl font-black text-brand-dark mb-8">Recently Viewed</h1>

        {loading ? (
          <div className="flex h-40 w-full items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-200">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">history</span>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">No history found</h2>
            <p className="text-slate-500 mb-8">You haven't viewed any products yet.</p>
            <Link to="/products" className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentProducts.map(product => (
              <div key={product.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 flex flex-col group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div 
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-slate-50 cursor-pointer"
                >
                  <img src={product.image || product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="font-bold text-slate-800 line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="font-black text-lg text-slate-800">₱{product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default RecentlyViewedView;
