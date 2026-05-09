import { useState } from 'react';
import { useCartModel } from '../Model/CartContext';
import { supabase } from '../../../../src/supabaseClient';

export const useCartPresenter = (navigate) => {
  const { items, getCartTotal, clearCart, removeFromCart, updateQuantity, getCartItemsCount } = useCartModel();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleCheckout = async (user) => {
    if (!user) {
      alert("Please log in to checkout.");
      navigate('/');
      return;
    }

    setIsCheckingOut(true);
    
    // Simulate order processing
    setTimeout(async () => {
      const orderData = {
        user_email: user.email,
        total_amount: getCartTotal(),
        status: 'pending',
        items: items
      };

      // We'll use the existing appointments table for now, or just simulate it since there isn't an orders table
      // In a real app we'd insert into an 'orders' table
      console.log("Order processed:", orderData);
      
      const fakeOrderId = "ORD-" + Math.floor(Math.random() * 1000000);
      setOrderId(fakeOrderId);
      setShowOrderStatus(true);
      clearCart();
      setIsCheckingOut(false);
    }, 2000);
  };

  return {
    items,
    getCartTotal,
    removeFromCart,
    updateQuantity,
    getCartItemsCount,
    isCheckingOut,
    showOrderStatus,
    orderId,
    setShowOrderStatus,
    handleCheckout
  };
};
