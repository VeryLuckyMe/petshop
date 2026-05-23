import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCartModel } from '../features/Cart/Model/CartContext';

function Navbar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemsCount } = useCartModel();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 pt-6 font-display sticky top-0 z-50">
      <header className="glass-nav rounded-full px-6 md:px-8 py-3.5 flex items-center justify-between whitespace-nowrap transition-all duration-300">
        <div className="flex items-center gap-10">
          <Link to="/dashboard" className="flex items-center gap-2.5 text-[#1B3C53] group">
            <div className="w-9 h-9 rounded-full bg-[#1B3C53] group-hover:bg-[#ec5b13] transition-colors duration-500 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">pets</span>
            </div>
            <h2 className="text-[#1B3C53] text-lg font-black leading-tight tracking-tight font-display transition-colors duration-500">
              Zootopia
            </h2>
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            {[
              { label: 'Home', path: '/dashboard' },
              { label: 'Products', path: '/products' },
              { label: 'Services', path: '/services' },
              { label: 'About Us', path: '/about' },
              { label: 'Help', path: '/help' },
            ].map((link) => (
              <Link
                key={link.path}
                className={`relative text-sm font-semibold transition-colors duration-300 py-1 ${
                  isActive(link.path) ? 'text-[#ec5b13]' : 'text-[#456882] hover:text-[#1B3C53]'
                }`}
                to={link.path}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ec5b13] rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <label className="hidden lg:flex flex-col w-48">
            <div className="flex w-full items-center rounded-full h-8.5 overflow-hidden bg-slate-100 border border-slate-200 focus-within:border-[#ec5b13]/50 focus-within:bg-white transition-all duration-300">
              <div className="text-[#456882] flex items-center justify-center pl-3">
                <span className="material-symbols-outlined text-lg">search</span>
              </div>
              <input
                className="w-full bg-transparent border-none focus:ring-0 placeholder:text-slate-400 text-xs text-[#1B3C53] font-normal px-2 outline-none"
                placeholder="Search resources..."
                type="text"
              />
            </div>
          </label>
          <div className="flex items-center gap-4">
            {user && (
              <Link
                to="/profile"
                className="text-[#1B3C53] text-xs hidden sm:inline hover:text-[#ec5b13] transition-colors cursor-pointer font-bold tracking-wide uppercase"
              >
                {user.user_metadata?.username || user.email.split('@')[0]}
              </Link>
            )}
            <Link to="/recently-viewed" className="relative text-[#1B3C53] hover:text-[#ec5b13] transition-colors duration-300 flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100/60">
              <span className="material-symbols-outlined text-xl">history</span>
            </Link>
            <Link to="/wishlist" className="relative text-[#1B3C53] hover:text-[#ec5b13] transition-colors duration-300 flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100/60">
              <span className="material-symbols-outlined text-xl">favorite</span>
            </Link>
            <Link to="/cart" className="relative text-[#1B3C53] hover:text-[#ec5b13] transition-colors duration-300 flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100/60">
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#ec5b13] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>
            <button
              onClick={handleSignOut}
              className="flex cursor-pointer items-center justify-center rounded-full h-9 px-5 bg-[#1B3C53] hover:bg-[#ec5b13] text-white text-xs font-bold transition-all duration-500 shadow-md hover:shadow-[#ec5b13]/20"
            >
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Navbar;

