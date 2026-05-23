import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload
      };

    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, { items: [] });
  const [user, setUser] = useState(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchCart(session.user.email);
        fetchLoyaltyPoints(session.user.email);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchCart(session.user.email);
        fetchLoyaltyPoints(session.user.email);
      } else {
        setUser(null);
        setLoyaltyPoints(0);
        dispatch({ type: 'CLEAR_CART' });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCart = async (email) => {
    const { data, error } = await supabase
      .from('cart')
      .select('product_id, quantity, products (*)')
      .eq('user_email', email);

    if (!error && data) {
      const cartItems = data.map(item => ({
        ...item.products,
        quantity: item.quantity
      }));
      dispatch({ type: 'SET_CART', payload: cartItems });
    }
  };

  const addToCart = async (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });

    if (user) {
      const existingItem = cartState.items.find(item => item.id === product.id);
      if (existingItem) {
        await supabase
          .from('cart')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('user_email', user.email)
          .eq('product_id', product.id);
      } else {
        await supabase
          .from('cart')
          .insert({
            user_email: user.email,
            product_id: product.id,
            quantity: 1
          });
      }
    }
  };

  const removeFromCart = async (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });

    if (user) {
      await supabase
        .from('cart')
        .delete()
        .eq('user_email', user.email)
        .eq('product_id', productId);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity === 0) {
      await removeFromCart(productId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });

      if (user) {
        await supabase
          .from('cart')
          .update({ quantity: quantity })
          .eq('user_email', user.email)
          .eq('product_id', productId);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });

    if (user) {
      await supabase
        .from('cart')
        .delete()
        .eq('user_email', user.email);
    }
  };

  const getCartTotal = () => {
    return cartState.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cartState.items.reduce((total, item) => total + item.quantity, 0);
  };

  const fetchLoyaltyPoints = async (email) => {
    const { data, error } = await supabase
      .from('zootopiaDatabase')
      .select('loyalty_points')
      .eq('email', email)
      .maybeSingle();

    if (!error && data) {
      setLoyaltyPoints(data.loyalty_points || 0);
    }
  };

  const updateLoyaltyPoints = async (newPoints) => {
    if (user) {
      setLoyaltyPoints(newPoints);
      await supabase
        .from('zootopiaDatabase')
        .update({ loyalty_points: newPoints })
        .eq('email', user.email);
    }
  };

  const useLoyaltyPoints = (pointsToUse) => {
    if (loyaltyPoints >= pointsToUse) {
      updateLoyaltyPoints(loyaltyPoints - pointsToUse);
      return true;
    }
    return false;
  };

  // ₱50 discount for every 10 points
  const getVoucherDiscount = () => {
    return Math.floor(loyaltyPoints / 10) * 50;
  };

  return (
    <CartContext.Provider
      value={{
        items: cartState.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        loyaltyPoints,
        useLoyaltyPoints,
        getVoucherDiscount,
        updateLoyaltyPoints
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartModel = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartModel must be used within a CartProvider');
  }
  return context;
};
