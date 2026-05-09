import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCartModel } from '../features/Cart/Model/CartContext';

function Navbar({ user }) {
  const navigate = useNavigate();
  const { getCartItemsCount } = useCartModel();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap bg-brand-dark border-b border-brand-medium px-6 md:px-20 py-4 font-display">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="flex items-center gap-3 text-white group">
          <span className="material-symbols-outlined text-3xl group-hover:text-primary transition-colors">pets</span>
          <h2 className="text-white text-xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors">Zootopia</h2>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal" to="/dashboard">Home</Link>
          <Link className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal" to="/products">Products</Link>
          <Link className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal" to="/services">Services</Link>
          <Link className="text-white hover:text-primary transition-colors text-sm font-medium leading-normal" to="/about">About Us</Link>
        </nav>
      </div>
      <div className="flex flex-1 justify-end gap-6 items-center">
        <label className="hidden lg:flex flex-col min-w-40 !h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden">
            <div className="text-brand-soft flex border-none bg-brand-medium items-center justify-center pl-4 pr-1">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 border-none bg-brand-medium text-white focus:ring-0 placeholder:text-brand-soft/60 px-2 text-sm font-normal"
              placeholder="Search..."
              type="text"
            />
          </div>
        </label>
        <div className="flex items-center gap-4">
          {user && (
            <Link
              to="/profile"
              className="text-brand-soft text-sm hidden sm:inline hover:text-primary transition-colors cursor-pointer font-bold"
            >
              {user.user_metadata?.username || user.email}
            </Link>
          )}
          <Link to="/cart" className="relative text-brand-soft hover:text-primary transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            {getCartItemsCount() > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {getCartItemsCount()}
              </span>
            )}
          </Link>
          <button
            onClick={handleSignOut}
            className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold transition-all hover:brightness-110"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
