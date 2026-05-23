import { useState } from 'react';
import { useCartModel } from '../Model/CartContext';
import { supabase } from '../../../../src/supabaseClient';

export const useCartPresenter = (navigate) => {
  const { 
    items, getCartTotal, clearCart, removeFromCart, updateQuantity, getCartItemsCount,
    loyaltyPoints, useLoyaltyPoints, getVoucherDiscount
  } = useCartModel();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [applyPoints, setApplyPoints] = useState(false);

  const handleCheckout = async (user) => {
    if (!user) {
      alert("Please log in to checkout.");
      navigate('/');
      return;
    }

    setIsCheckingOut(true);
    
    try {
      // 1. Fetch user's default shipping address from 'addresses' table
      const { data: addrData, error: addrError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .maybeSingle();

      let addressStr = "No default address saved. Contact Customer Support.";
      if (!addrError && addrData) {
        addressStr = `${addrData.full_name} (${addrData.phone}) | ${addrData.address_line_1}${
          addrData.address_line_2 ? ', ' + addrData.address_line_2 : ''
        }, ${addrData.city}, ${addrData.state_province} ${addrData.postal_code} [${addrData.label}]`;
      }

      // Calculate checkout values
      const total = getCartTotal();
      const shipping = total > 1000 ? 0 : 100;
      const discountAmount = applyPoints ? getVoucherDiscount() : 0;
      const finalTotal = Math.max(0, total + shipping - discountAmount);

      // 2. Insert order row into direct Supabase 'orders' schema
      const orderPayload = {
        user_email: user.email,
        total_amount: finalTotal,
        status: 'pending',
        shipping_address: addressStr,
        items: items.map(itm => ({
          id: itm.id,
          name: itm.name,
          price: itm.price,
          quantity: itm.quantity,
          image_url: itm.image_url
        }))
      };

      const { data: insertData, error: insertError } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select();

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Deduct loyalty points if checkbox was ticked
      if (applyPoints) {
        useLoyaltyPoints(Math.floor(loyaltyPoints / 10) * 10);
      }

      const orderRef = insertData && insertData[0] ? insertData[0].id : "ORD-" + Math.floor(Math.random() * 1000000);
      
      // Delay briefly for premium visual spinner feel
      setTimeout(async () => {
        setOrderId(orderRef);
        setShowOrderStatus(true);
        clearCart();
        setIsCheckingOut(false);
        setApplyPoints(false);
      }, 1200);

    } catch (e) {
      alert("Checkout failed: " + e.message);
      setIsCheckingOut(false);
    }
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
    handleCheckout,
    loyaltyPoints,
    getVoucherDiscount,
    applyPoints,
    setApplyPoints
  };
};
