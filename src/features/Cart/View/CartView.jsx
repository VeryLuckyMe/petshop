import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { useCartPresenter } from '../Presenter/CartPresenter';
import { supabase } from '../../../../src/supabaseClient';

function CartView() {
  const navigate = useNavigate();
  const {
    items, getCartTotal, removeFromCart, updateQuantity,
    isCheckingOut, showOrderStatus, orderId, setShowOrderStatus, handleCheckout
  } = useCartPresenter(navigate);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };
    init();
  }, []);

  const total = getCartTotal();
  const shipping = total > 1000 ? 0 : 100;
  const finalTotal = total + shipping;

  if (showOrderStatus && orderId) {
    return (
      <div className="min-h-screen bg-slate-100 font-display">
        <Navbar user={user} />
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full">
            <span className="material-symbols-outlined text-6xl text-green-500 mb-4">check_circle</span>
            <h2 className="text-3xl font-black text-slate-800 mb-2">Order Confirmed!</h2>
            <p className="text-slate-500 mb-6">Your order #{orderId} has been placed successfully.</p>
            <Link to="/products" className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-display">
      <Navbar user={user} />
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-4xl font-black text-brand-dark mb-8">Your Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-200">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">shopping_cart</span>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-slate-200">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                    <p className="text-sm text-slate-500">{item.category}</p>
                    <p className="font-black text-primary mt-2">₱{item.price}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:text-primary font-bold">-</button>
                      <span className="w-10 text-center font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:text-primary font-bold">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 sticky top-8">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b border-slate-100">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-800">₱{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="font-bold text-slate-800">{shipping === 0 ? 'FREE' : `₱${shipping.toFixed(2)}`}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-4 border-t border-slate-100 mb-8">
                  <span className="font-bold text-slate-800">Total</span>
                  <span className="font-black text-2xl text-primary">₱{finalTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => handleCheckout(user)}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-brand-dark text-white font-bold rounded-xl hover:bg-primary transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isCheckingOut ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Checkout <span className="material-symbols-outlined text-sm">arrow_forward</span></>
                  )}
                </button>
                <div className="mt-6 flex justify-center gap-4 text-slate-400">
                  <span className="material-symbols-outlined" title="Secure Payment">lock</span>
                  <span className="material-symbols-outlined" title="Fast Shipping">local_shipping</span>
                  <span className="material-symbols-outlined" title="Easy Returns">assignment_return</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CartView;
