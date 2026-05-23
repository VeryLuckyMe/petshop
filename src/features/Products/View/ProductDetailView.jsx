import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import { supabase } from '../../../supabaseClient';
import { useCartModel } from '../../Cart/Model/CartContext';
import { useWishlist } from '../../Wishlist/Model/WishlistContext';

// Rich fallback/supplemental product data matching the PawMarket design and values
const ENRICHED_PRODUCTS_DATA = {
  1: {
    sku: 'PM-10421',
    stockStatus: 'In Stock',
    oldPrice: 3125,
    discount: 'SAVE 20%',
    longDescription: "Royal Canin Adult Premium is a complete and balanced food formulated for medium dogs (11 to 25 kg) from 12 months to 7 years old. It helps support the dog's natural defenses, thanks particularly to an antioxidant complex and manno-oligo-saccharides. Enriched with Omega 3 fatty acids (EPA-DHA) to help maintain healthy skin.",
    features: [
      'High digestibility for adult dogs',
      'Omega-3 fatty acids for skin and coat health',
      'Exclusive kibble design encourages chewing',
      'Supports natural defenses'
    ],
    sizes: ['1 kg', '2 kg', '5 kg', '10 kg', '15 kg'],
    flavors: ['Chicken', 'Beef', 'Salmon', 'Lamb'],
    images: [
      '/images/mnvybq1v-v6t6rlx.png',
      '/images/mnvybq1v-eugcbf9.png',
      '/images/mnvybq1v-mjzc7js.png',
      '/images/mnvybq1v-dce60t4.png'
    ],
    rating: 4.8,
    reviewsCount: 42
  },
  2: {
    sku: 'PM-20512',
    stockStatus: 'In Stock',
    oldPrice: 2200,
    discount: 'SAVE 15%',
    longDescription: 'Our Professional Grooming Kit is designed to provide a stress-free grooming experience for both you and your pet. The low-noise motor ensures your pet stays calm, while the precision blades provide a clean cut every time.',
    features: [
      'Low noise design for nervous pets',
      'High-precision stainless steel blades',
      'Includes 4 attachment combs',
      'Long-lasting rechargeable battery'
    ],
    sizes: ['Standard'],
    flavors: ['Classic Silver'],
    images: [
      '/images/mnvybq1v-eugcbf9.png',
      '/images/mnvybq1v-v6t6rlx.png',
      '/images/mnvybq1v-mjzc7js.png',
      '/images/mnvybq1v-dce60t4.png'
    ],
    rating: 4.2,
    reviewsCount: 28
  },
  3: {
    sku: 'PM-30119',
    stockStatus: 'In Stock',
    oldPrice: 1000,
    discount: 'SAVE 20%',
    longDescription: 'Keep your feline friend active and engaged with our Interactive Feather Cat Toy. The unpredictable movement of the feathers mimics real prey, stimulating your cat\'s natural hunting instincts.',
    features: [
      'Durable construction',
      'Safe, non-toxic materials',
      'Replaceable feather attachments',
      'Stimulates mental and physical health'
    ],
    sizes: ['One Size'],
    flavors: ['Rainbow', 'Natural'],
    images: [
      '/images/mnvybq1v-mjzc7js.png',
      '/images/mnvybq1v-v6t6rlx.png',
      '/images/mnvybq1v-eugcbf9.png',
      '/images/mnvybq1v-dce60t4.png'
    ],
    rating: 4.5,
    reviewsCount: 156
  },
  4: {
    sku: 'PM-40223',
    stockStatus: 'In Stock',
    oldPrice: 850,
    discount: 'SAVE 18%',
    longDescription: 'Our Organic Bird Seeds are sourced from the finest farms to ensure your feathered friends get the best nutrition possible. No artificial colors or preservatives.',
    features: [
      '100% Organic ingredients',
      'Rich in vitamins and minerals',
      'Supports healthy plumage',
      'Easy to digest'
    ],
    sizes: ['500g', '1kg', '2kg'],
    flavors: ['Original Mix'],
    images: [
      '/images/mnvybq1v-v6t6rlx.png',
      '/images/mnvybq1v-mjzc7js.png',
      '/images/mnvybq1v-eugcbf9.png',
      '/images/mnvybq1v-dce60t4.png'
    ],
    rating: 4.0,
    reviewsCount: 15
  },
  5: {
    sku: 'PM-50991',
    stockStatus: 'In Stock',
    oldPrice: 5500,
    discount: 'SAVE ₱700',
    longDescription: 'The Orthopedic Fluffy Pet Bed features a high-density memory foam base that provides superior support for your pet\'s joints. The ultra-soft plush cover adds an extra layer of comfort.',
    features: [
      'Memory foam base',
      'Machine-washable cover',
      'Non-slip bottom',
      'Relieves joint pain'
    ],
    sizes: ['Small', 'Medium', 'Large', 'Extra Large'],
    flavors: ['Grey', 'Beige', 'Blue'],
    images: [
      '/images/mnvybq1v-dce60t4.png',
      '/images/mnvybq1v-v6t6rlx.png',
      '/images/mnvybq1v-mjzc7js.png',
      '/images/mnvybq1v-eugcbf9.png'
    ],
    rating: 4.9,
    reviewsCount: 89
  },
  6: {
    sku: 'PM-60334',
    stockStatus: 'In Stock',
    oldPrice: 1500,
    discount: 'SAVE 13%',
    longDescription: 'Tame your strongest pullers with our Heavy Duty Dog Leash. Made from high-quality climbing rope, it\'s designed to withstand the toughest tugs while keeping your hands comfortable.',
    features: [
      'Reinforced climbing rope',
      'Padded comfort handle',
      'Reflective stitching for night safety',
      'Heavy-duty carabiner clip'
    ],
    sizes: ['1.5m', '2m'],
    flavors: ['Black', 'Orange', 'Green'],
    images: [
      '/images/mnvybq1w-a4pxonk.png',
      '/images/mnvybq1v-v6t6rlx.png',
      '/images/mnvybq1v-mjzc7js.png',
      '/images/mnvybq1v-eugcbf9.png'
    ],
    rating: 4.7,
    reviewsCount: 64
  }
};

function ProductDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartModel();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [toast, setToast] = useState({ show: false, message: '' });

  // Load user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
    });
  }, []);

  // Fetch product from Supabase & enrich with local fallbacks
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data: dbProduct, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Find supplemental info based on ID or Name similarity
        const enrichId = id % 6 || 6;
        const enrichInfo = ENRICHED_PRODUCTS_DATA[dbProduct.id] || ENRICHED_PRODUCTS_DATA[enrichId] || ENRICHED_PRODUCTS_DATA[1];

        const finalProduct = {
          id: dbProduct.id,
          name: dbProduct.name,
          category: dbProduct.category,
          price: dbProduct.price,
          image: dbProduct.image_url,
          sku: enrichInfo.sku,
          stockStatus: enrichInfo.stockStatus,
          oldPrice: enrichInfo.oldPrice,
          discount: enrichInfo.discount,
          description: dbProduct.description || enrichInfo.longDescription.substring(0, 150) + '...',
          longDescription: enrichInfo.longDescription,
          features: enrichInfo.features,
          sizes: enrichInfo.sizes,
          flavors: enrichInfo.flavors,
          images: [dbProduct.image_url, ...enrichInfo.images.slice(1)],
          rating: enrichInfo.rating,
          reviewsCount: enrichInfo.reviewsCount
        };

        setProduct(finalProduct);
        setMainImage(finalProduct.image);
        setSelectedSize(finalProduct.sizes[0]);
        setSelectedFlavor(finalProduct.flavors[0]);

        // Log to Recently Viewed (local storage & database)
        logRecentlyViewed(finalProduct);

      } catch (err) {
        console.error('Failed to load product from database, using fallback', err);
        // Local Fallback based on ID
        const fallbackId = parseInt(id) || 1;
        const enrichId = ((fallbackId - 1) % 6) + 1;
        const enrichInfo = ENRICHED_PRODUCTS_DATA[enrichId];
        
        // Simulating a DB-like item
        const fallbackProduct = {
          id: fallbackId,
          name: fallbackId === 1 ? 'Royal Canin Adult Premium Dog Food' : fallbackId === 2 ? 'Professional Grooming Kit' : fallbackId === 3 ? 'Interactive Feather Cat Toy' : fallbackId === 4 ? 'Organic Bird Seeds' : fallbackId === 5 ? 'Orthopedic Fluffy Pet Bed' : 'Heavy Duty Dog Leash',
          category: fallbackId === 1 ? 'Dog Food' : fallbackId === 2 ? 'Grooming Kit' : fallbackId === 3 ? 'Cat Toy' : fallbackId === 4 ? 'Bird Food' : fallbackId === 5 ? 'Pet Bed' : 'Accessories',
          price: fallbackId === 1 ? 2500 : fallbackId === 2 ? 1850 : fallbackId === 3 ? 800 : fallbackId === 4 ? 700 : fallbackId === 5 ? 4800 : 1300,
          image: enrichInfo.images[0],
          sku: enrichInfo.sku,
          stockStatus: enrichInfo.stockStatus,
          oldPrice: enrichInfo.oldPrice,
          discount: enrichInfo.discount,
          description: enrichInfo.longDescription.substring(0, 150) + '...',
          longDescription: enrichInfo.longDescription,
          features: enrichInfo.features,
          sizes: enrichInfo.sizes,
          flavors: enrichInfo.flavors,
          images: enrichInfo.images,
          rating: enrichInfo.rating,
          reviewsCount: enrichInfo.reviewsCount
        };

        setProduct(fallbackProduct);
        setMainImage(fallbackProduct.image);
        setSelectedSize(fallbackProduct.sizes[0]);
        setSelectedFlavor(fallbackProduct.flavors[0]);

        logRecentlyViewed(fallbackProduct);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const logRecentlyViewed = async (prod) => {
    // 1. Local Storage log
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const isAlreadyViewed = viewed.find(p => p.id === prod.id);
    if (!isAlreadyViewed) {
      const updatedViewed = [prod, ...viewed].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed));
    }

    // 2. Database Sync
    const sessionRes = await supabase.auth.getSession();
    const currUser = sessionRes?.data?.session?.user;
    if (currUser?.id) {
      try {
        await supabase
          .from('recently_viewed')
          .upsert({
            user_id: currUser.id,
            product_id: prod.id,
            viewed_at: new Date().toISOString()
          });
      } catch (err) {
        console.error('Failed to log recently viewed history to DB', err);
      }
    }
  };

  const showToastNotification = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const handleAddToCart = () => {
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image,
      category: product.category,
      quantity: quantity,
      selectedSize,
      selectedFlavor
    };
    addToCart(cartProduct);
    showToastNotification(`Added ${quantity} x ${product.name} (${selectedSize}, ${selectedFlavor}) to cart!`);
  };

  const handleBuyNow = () => {
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image,
      category: product.category,
      quantity: quantity,
      selectedSize,
      selectedFlavor
    };
    addToCart(cartProduct);
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      showToastNotification(`Removed ${product.name} from wishlist.`);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image,
        category: product.category
      });
      showToastNotification(`Added ${product.name} to wishlist!`);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark font-display">
        <h1 className="text-3xl font-black text-brand-dark dark:text-white mb-4">Product Not Found</h1>
        <Link to="/products" className="px-6 py-3 bg-brand-dark text-white rounded-xl hover:bg-primary transition-all">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-[#faf8f5] dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Toast Alert */}
      {toast.show && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-3 bg-white dark:bg-brand-dark border border-brand-soft/80 shadow-2xl p-4 rounded-xl animate-fade-in-up backdrop-blur-xl">
          <span className="material-symbols-outlined text-green-500">check_circle</span>
          <span className="text-sm font-bold text-brand-dark dark:text-white">{toast.message}</span>
        </div>
      )}

      <div className="layout-container flex h-full grow flex-col">
        <Navbar user={user} />
        
        <main className="flex flex-1 flex-col items-center px-4 md:px-8 py-6">
          <div className="w-full max-w-[1200px]">
            
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 mb-8 text-xs font-bold text-[#585894] dark:text-brand-light uppercase tracking-wider">
              <Link to="/dashboard" className="hover:text-primary transition-colors">Home</Link>
              <span>•</span>
              <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
              <span>•</span>
              <span className="text-brand-dark dark:text-slate-300">{product.category}</span>
            </nav>

            {/* Immersive Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
              
              {/* Left Column - Image & Gallery (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Main Product Card */}
                <div className="w-full aspect-square bg-white dark:bg-brand-dark border border-[#f0eae1] dark:border-brand-medium rounded-[32px] overflow-hidden shadow-sm flex items-center justify-center p-8 relative">
                  <img 
                    src={mainImage} 
                    alt={product.name} 
                    className="w-full h-full object-contain transition-all duration-300 hover:scale-105"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-primary/10 text-primary dark:bg-primary/20 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Gallery Thumbnails */}
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImage(img)}
                      className={`aspect-square bg-white dark:bg-brand-dark border rounded-2xl overflow-hidden p-2 flex items-center justify-center transition-all ${
                        mainImage === img 
                          ? 'border-[#fa782d] ring-2 ring-primary/20 scale-95' 
                          : 'border-[#f0eae1] dark:border-brand-medium hover:border-brand-light'
                      }`}
                    >
                      <img src={img} alt={`Angle ${idx}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>

                {/* Gallery Quick Actions */}
                <div className="flex gap-4 mt-2">
                  <button 
                    onClick={handleWishlistToggle}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-white dark:bg-brand-dark border border-[#e8dfd0] dark:border-brand-medium rounded-full shadow-sm hover:bg-slate-50 transition-all font-bold text-[#585894] dark:text-slate-300 hover:scale-[1.02]"
                  >
                    <span 
                      className={`material-symbols-outlined ${
                        isInWishlist(product.id) ? 'fill-primary text-primary' : 'text-[#585894]'
                      }`}
                    >
                      {isInWishlist(product.id) ? 'favorite' : 'favorite_border'}
                    </span>
                    <span>{isInWishlist(product.id) ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      showToastNotification("Copied product page link to clipboard!");
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-white dark:bg-brand-dark border border-[#e8dfd0] dark:border-brand-medium rounded-full shadow-sm hover:bg-slate-50 transition-all font-bold text-[#585894] dark:text-slate-300 hover:scale-[1.02]"
                  >
                    <span className="material-symbols-outlined text-sm">share</span>
                    <span>Share</span>
                  </button>
                </div>

              </div>

              {/* Right Column - Info & Options (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col">
                
                {/* Brand & SKU Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-[#fa782d] tracking-wider">Premium Petcare</span>
                  <span className="text-xs font-bold text-brand-light">SKU: {product.sku}</span>
                </div>

                {/* Main Product Title */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#2c2c54] dark:text-white leading-tight mb-4">
                  {product.name}
                </h1>

                {/* Rating & Review Info row */}
                <div className="flex items-center gap-4 mb-6 text-sm font-bold text-slate-500">
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {[1, 2, 3, 4].map(s => (
                      <span key={s} className="material-symbols-outlined text-lg fill-current">star</span>
                    ))}
                    <span className="material-symbols-outlined text-lg fill-current">star_half</span>
                    <span className="ml-1 text-brand-dark dark:text-slate-300">{product.rating}</span>
                  </div>
                  <span>•</span>
                  <span className="text-brand-light cursor-pointer hover:text-primary transition-colors underline">
                    {product.reviewsCount} Reviews
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-500">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    {product.stockStatus}
                  </span>
                </div>

                {/* Price Display Block */}
                <div className="flex items-center gap-4 bg-white dark:bg-brand-dark border border-[#f0eae1] dark:border-brand-medium rounded-2xl p-5 mb-8 shadow-sm">
                  <span className="text-3xl font-black text-primary">
                    ₱{product.price.toLocaleString()}.00
                  </span>
                  <span className="text-lg font-bold text-brand-light line-through">
                    ₱{product.oldPrice.toLocaleString()}.00
                  </span>
                  <div className="bg-[#e2f7f1] text-[#00b087] dark:bg-emerald-950 dark:text-emerald-400 font-black text-xs px-3 py-1.5 rounded-lg">
                    {product.discount}
                  </div>
                </div>

                {/* Product Brief Short description */}
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Weight Selector */}
                <div className="mb-6">
                  <h3 className="text-xs font-black text-brand-dark dark:text-slate-300 uppercase tracking-wider mb-3">
                    Weight / Size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                          selectedSize === size
                            ? 'bg-[#fa782d] text-white border-primary shadow-sm scale-95'
                            : 'bg-white dark:bg-brand-dark text-slate-700 dark:text-slate-300 border-[#f0eae1] dark:border-brand-medium hover:border-brand-light'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flavor Selector */}
                <div className="mb-8">
                  <h3 className="text-xs font-black text-brand-dark dark:text-slate-300 uppercase tracking-wider mb-3">
                    Flavor / Variety
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map(flavor => (
                      <button
                        key={flavor}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                          selectedFlavor === flavor
                            ? 'bg-[#007f6e] text-white border-[#007f6e] shadow-sm scale-95'
                            : 'bg-white dark:bg-brand-dark text-slate-700 dark:text-slate-300 border-[#f0eae1] dark:border-brand-medium hover:border-brand-light'
                        }`}
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & CTA Buttons Row */}
                <div className="border-t border-[#f0eae1] dark:border-brand-medium pt-8">
                  <h3 className="text-xs font-black text-brand-dark dark:text-slate-300 uppercase tracking-wider mb-4">
                    Purchase Options
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    
                    {/* Quantity Selector Counter */}
                    <div className="flex items-center justify-between border border-[#e8dfd0] dark:border-brand-medium bg-white dark:bg-brand-dark rounded-full px-4 py-2 w-full sm:w-32 h-12 shadow-sm">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-slate-500 hover:text-primary font-bold text-lg p-1"
                      >
                        remove
                      </button>
                      <span className="font-extrabold text-sm text-brand-dark dark:text-white">
                        {quantity}
                      </span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="text-slate-500 hover:text-primary font-bold text-lg p-1"
                      >
                        add
                      </button>
                    </div>

                    {/* Add To Cart */}
                    <button 
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#fa782d] hover:bg-opacity-95 text-white py-3 px-6 rounded-full font-black text-sm shadow-md hover:shadow-lg transition-all h-12 active:scale-95"
                    >
                      Add to Cart
                    </button>

                    {/* Buy Now */}
                    <button 
                      onClick={handleBuyNow}
                      className="flex-1 bg-[#007f6e] hover:bg-opacity-95 text-white py-3 px-6 rounded-full font-black text-sm shadow-md hover:shadow-lg transition-all h-12 flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>Buy Now</span>
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>

                  </div>
                </div>

                {/* Trust Badges Banner */}
                <div className="mt-8 grid grid-cols-3 gap-2 bg-[#f4effa] dark:bg-indigo-950/20 border border-[#ebe4f5] dark:border-indigo-900/30 rounded-2xl p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
                    <span className="text-[10px] font-black uppercase text-[#585894] dark:text-slate-300">Free Shipping</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 border-x border-[#ebe4f5] dark:border-indigo-900/30">
                    <span className="material-symbols-outlined text-primary text-xl">replay</span>
                    <span className="text-[10px] font-black uppercase text-[#585894] dark:text-slate-300">30-Day Returns</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                    <span className="text-[10px] font-black uppercase text-[#585894] dark:text-slate-300">Secure Checkout</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Tabs Details Section */}
            <div className="bg-white dark:bg-brand-dark border border-[#f0eae1] dark:border-brand-medium rounded-3xl p-6 md:p-8 shadow-sm mb-12">
              <div className="flex border-b border-slate-100 dark:border-brand-medium pb-4 mb-6 overflow-x-auto gap-8">
                {['description', 'specifications', 'reviews', 'related'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-sm font-black uppercase tracking-wider pb-2 border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab
                        ? 'border-primary text-primary'
                        : 'border-transparent text-brand-light hover:text-brand-dark dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {activeTab === 'description' && (
                  <div className="space-y-4 animate-fade-in">
                    <p className="font-medium text-base text-brand-dark dark:text-slate-200">
                      Product Description
                    </p>
                    <p className="leading-relaxed">
                      {product.longDescription}
                    </p>
                    <div className="pt-4">
                      <p className="font-bold text-brand-dark dark:text-slate-200 mb-2">Key Highlights & Features:</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {product.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="space-y-4 animate-fade-in">
                    <table className="min-w-full divide-y divide-slate-100 dark:divide-brand-medium text-left">
                      <tbody className="divide-y divide-slate-100 dark:divide-brand-medium">
                        <tr>
                          <td className="py-3 font-black text-brand-dark dark:text-slate-300 w-1/3">Stock Status</td>
                          <td className="py-3 text-slate-500">{product.stockStatus}</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-black text-brand-dark dark:text-slate-300 w-1/3">SKU Identifier</td>
                          <td className="py-3 text-slate-500">{product.sku}</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-black text-brand-dark dark:text-slate-300 w-1/3">Weight Variants</td>
                          <td className="py-3 text-slate-500">{product.sizes.join(', ')}</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-black text-brand-dark dark:text-slate-300 w-1/3">Flavors Offered</td>
                          <td className="py-3 text-slate-500">{product.flavors.join(', ')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50 dark:bg-background-dark/50 p-6 rounded-2xl border border-slate-100 dark:border-brand-medium">
                      <div className="text-center">
                        <div className="text-5xl font-black text-brand-dark dark:text-white mb-2">{product.rating}</div>
                        <div className="flex text-amber-500 justify-center gap-0.5 mb-1">
                          {[1, 2, 3, 4].map(s => (
                            <span key={s} className="material-symbols-outlined text-sm fill-current">star</span>
                          ))}
                          <span className="material-symbols-outlined text-sm fill-current">star_half</span>
                        </div>
                        <div className="text-xs text-brand-light font-bold uppercase">{product.reviewsCount} Product Reviews</div>
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold w-12 text-slate-400">5 star</span>
                          <div className="flex-1 bg-slate-200 dark:bg-brand-medium h-2 rounded-full overflow-hidden">
                            <div className="bg-[#fa782d] h-full" style={{ width: '85%' }}></div>
                          </div>
                          <span className="text-xs font-bold text-slate-400 w-8">85%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold w-12 text-slate-400">4 star</span>
                          <div className="flex-1 bg-slate-200 dark:bg-brand-medium h-2 rounded-full overflow-hidden">
                            <div className="bg-[#fa782d] h-full" style={{ width: '12%' }}></div>
                          </div>
                          <span className="text-xs font-bold text-slate-400 w-8">12%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold w-12 text-slate-400">3 star</span>
                          <div className="flex-1 bg-slate-200 dark:bg-brand-medium h-2 rounded-full overflow-hidden">
                            <div className="bg-[#fa782d] h-full" style={{ width: '3%' }}></div>
                          </div>
                          <span className="text-xs font-bold text-slate-400 w-8">3%</span>
                        </div>
                      </div>
                    </div>

                    {/* Simulated Customer Reviews List */}
                    <div className="divide-y divide-slate-100 dark:divide-brand-medium">
                      <div className="py-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-brand-dark dark:text-slate-200">Maria Santos</span>
                          <span className="text-xs text-brand-light">2 days ago</span>
                        </div>
                        <div className="flex text-amber-500 gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <span key={s} className="material-symbols-outlined text-xs fill-current">star</span>
                          ))}
                        </div>
                        <p className="text-slate-500 text-sm">
                          Highly recommended! My dog is extremely picky but absolutely loves this flavor. His digestion and coat shine have improved noticebly. Will buy again!
                        </p>
                      </div>
                      <div className="py-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-brand-dark dark:text-slate-200">Joshua Dela Cruz</span>
                          <span className="text-xs text-brand-light">1 week ago</span>
                        </div>
                        <div className="flex text-amber-500 gap-0.5">
                          {[1, 2, 3, 4].map(s => (
                            <span key={s} className="material-symbols-outlined text-xs fill-current">star</span>
                          ))}
                          <span className="material-symbols-outlined text-xs text-slate-300">star</span>
                        </div>
                        <p className="text-slate-500 text-sm">
                          Standard solid quality food. Keeps my pet energetic. Delivery was fast and in good condition. Great store service.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'related' && (
                  <div className="animate-fade-in text-center py-6 text-brand-light font-bold">
                    Related products in "{product.category}" category are currently being curated and will be available shortly!
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default ProductDetailView;
