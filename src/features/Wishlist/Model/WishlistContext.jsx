import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('wishlist')
            .select('*, products(*)')
            .eq('user_id', user.id);
            
          if (!error && data) {
            const products = data.map(item => ({
              ...item.products,
              image: item.products.image_url
            }));
            setWishlistItems(products);
          }
        } catch (err) {
          console.error('Fetch wishlist error:', err);
        }
      } else {
        setWishlistItems([]);
      }
    };

    fetchWishlist();
  }, [user?.id]);

  const addToWishlist = async (product) => {
    if (!user) return;
    
    setWishlistItems((prev) => {
      const isAlreadyIn = prev.find((item) => item.id === product.id);
      if (isAlreadyIn) return prev;
      return [...prev, product];
    });

    try {
      const { error } = await supabase
        .from('wishlist')
        .insert({
          product_id: product.id,
          user_id: user.id
        });
        
      if (error) {
        console.error('Error adding to wishlist:', error);
        setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
      }
    } catch (err) {
      console.error('Exception adding to wishlist:', err);
      setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;

    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
        
      if (error) {
        console.error('Error removing from wishlist:', error);
      }
    } catch (err) {
      console.error('Exception removing from wishlist:', err);
    }
  };

  const isInWishlist = (productId) => {
    return !!wishlistItems.find((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
