import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { useWishlist } from '../Model/WishlistContext';
import { supabase } from '../../../../src/supabaseClient';
import { useCartPresenter } from '../../Cart/Presenter/CartPresenter';

function WishlistView() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const { addToCart } = useCartPresenter(); // Assuming CartPresenter has addToCart. Actually CartPresenter doesn't expose it directly this way but we can use cartContext or we just do simple button.
  // Wait, Zootopia CartPresenter might not have addToCart exposed directly without navigate. Let's see how ProductsPresenter adds to cart.
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };
    init();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 font-display">
      <Navbar user={user} />
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-4xl font-black text-brand-dark mb-8">My Wishlist & Saved</h1>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-200">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">favorite_border</span>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Your wishlist is empty</h2>
            <p className="text-slate-500 mb-8">Looks like you haven't saved any items yet.</p>
            <Link to="/products" className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map(product => (
              <div key={product.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 flex flex-col group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 hover:scale-110 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                </button>
                <div 
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-slate-50 cursor-pointer"
                >
                  <img src={product.image || product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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

export default WishlistView;
