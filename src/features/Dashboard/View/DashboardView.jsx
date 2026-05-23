import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { useDashboardPresenter } from '../Presenter/DashboardPresenter';
import { useCartModel } from '../../Cart/Model/CartContext';

function DashboardView() {
  const navigate = useNavigate();
  const { user, loading, products, bookingStatus, handleBookService } = useDashboardPresenter(navigate);
  const { addToCart } = useCartModel();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f8f6f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <span className="material-symbols-outlined text-4xl text-[#1B3C53] paw-bounce-item" style={{ animationDelay: '0s' }}>pets</span>
            <span className="material-symbols-outlined text-4xl text-[#ec5b13] paw-bounce-item" style={{ animationDelay: '0.2s' }}>pets</span>
            <span className="material-symbols-outlined text-4xl text-[#456882] paw-bounce-item" style={{ animationDelay: '0.4s' }}>pets</span>
          </div>
          <p className="text-sm font-semibold text-[#1B3C53] tracking-wider uppercase animate-pulse">Syncing with Zootopia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden ambient-bg font-display text-slate-900 pb-16">
      <Navbar user={user} />
      <main className="flex flex-1 flex-col items-center w-full mt-6">
        <div className="w-full max-w-[1200px] px-6">
          {/* Cinematic Centered Hero */}
          <div className="relative rounded-3xl overflow-hidden min-h-[480px] flex flex-col items-center justify-center p-8 md:p-16 text-center shadow-xl border border-white/20 mb-16 bg-slate-900">
            <div 
              className="absolute inset-0 bg-center bg-cover scale-105 opacity-60 pointer-events-none transition-transform duration-1000"
              style={{ 
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCUPoBMX5MvwaJAoNc00Mnz7afdACyxkZirovqMACle-wFCrExOO1KwDXmsly8S_ehuuQDOacjLl_AERyXVREi6zGTgTmqqNcM7sIZ9lqfnx2_Hh70RV1xqqMjRZz8ha1z0nDoeZ7Lu7VP3iBQSyZTYvTLXWb2NBa4oA96LAyuuyUTQim-Sjy4WV7j580KP7Y2RDlI586KAkQSfuMzjbKwn1paeivX9LXLsifL2bS0HZZ3bouu7eJ1KfgAgwmUQemuW6WknJXxQ17E")',
                filter: 'brightness(0.4) contrast(1.1)' 
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B3C53]/95 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 max-w-4xl flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold tracking-widest uppercase border border-white/15">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ec5b13] animate-ping"></span>
                Zootopia Elite Care
              </span>
              <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight max-w-3xl font-['Outfit',sans-serif]">
                Your Pet's Happiness, <br />
                <span className="text-[#ec5b13]">Our Sacred Mission.</span>
              </h1>
              <p className="text-slate-200 text-base md:text-lg max-w-xl leading-relaxed">
                Experience next-generation clinical, grooming, and pet hospitality services, personalized down to every single paw-print.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center items-center">
                <button 
                  onClick={() => handleBookService('General Consultation')} 
                  className="w-full sm:w-48 py-3.5 bg-[#ec5b13] hover:bg-white hover:text-[#1B3C53] text-white font-extrabold rounded-full transition-all duration-300 shadow-lg hover:shadow-white/10 hover:scale-105 active:scale-95 text-sm uppercase tracking-wider"
                >
                  {bookingStatus === 'General Consultation' ? 'Consultation Booked!' : 'Book Consultation'}
                </button>
                <button 
                  onClick={() => navigate('/services')} 
                  className="w-full sm:w-48 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all duration-300 backdrop-blur-md border border-white/20 text-sm uppercase tracking-wider hover:scale-105"
                >
                  Explore Services
                </button>
              </div>
            </div>
          </div>

          {/* Featured Products Interlocking Bento Grid */}
          <section className="mb-16">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-10 border-b border-slate-200 pb-5">
              <div>
                <span className="text-[#ec5b13] text-xs font-black tracking-widest uppercase block mb-1">Curated Essentials</span>
                <h2 className="text-3xl font-black tracking-tight text-[#1B3C53] font-['Outfit',sans-serif]">Featured Collection</h2>
              </div>
              <button 
                onClick={() => navigate('/products')} 
                className="text-xs font-extrabold tracking-widest text-[#1B3C53] hover:text-[#ec5b13] uppercase flex items-center gap-1 transition-colors mt-2 md:mt-0"
              >
                View all items <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 grid-flow-row-dense gap-6">
              {products.map((product, index) => {
                // Interlocking layout col-spans
                const isLargeCard = index === 0;
                return (
                  <div 
                    key={product.id} 
                    className={`group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl hover:border-[#ec5b13]/20 transition-all duration-500 ${
                      isLargeCard ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1'
                    }`}
                  >
                    <div 
                      onClick={() => navigate(`/products/${product.id}`)}
                      className={`relative overflow-hidden cursor-pointer ${isLargeCard ? 'aspect-[4/3] md:aspect-auto md:grow' : 'aspect-square'}`}
                    >
                      <img 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                        src={product.image_url} 
                        alt={product.name} 
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#1B3C53] text-white text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <h4 
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="font-extrabold text-[#1B3C53] text-lg leading-snug group-hover:text-[#ec5b13] cursor-pointer transition-colors font-['Outfit',sans-serif]"
                        >
                          {product.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                          Premium quality product tested and highly recommended by our veterinary specialists.
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-5">
                        <span className="font-black text-xl text-[#1B3C53]">₱{product.price}</span>
                        <button 
                          onClick={() => addToCart(product)} 
                          className="bg-[#1B3C53] text-white p-3 rounded-full hover:bg-[#ec5b13] hover:scale-105 active:scale-95 transition-all duration-300 shadow-md"
                        >
                          <span className="material-symbols-outlined text-lg flex">add_shopping_cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
      <footer className="w-full text-center text-xs text-slate-400 py-10 mt-10 border-t border-slate-200">
        © 2026 Zootopia Animal Care Services. Crafted with refined editorial excellence.
      </footer>
    </div>
  );
}

export default DashboardView;

